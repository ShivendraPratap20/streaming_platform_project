import { memo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type UseQueryResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ProfileCard } from "../components/PageComponent/ProfilePageComp";
import api from "../api/axios";
import { type User } from "../utils/interfaces";
import { MySpace, MyDashboard } from "../components/PageComponent/ProfilePageComp/index";

const TabButton = memo(({ title, value, currentTab, handleClick }: { title: string, value: string, currentTab: string, handleClick: () => void }) => {
    return (
        <button
            className={`p-4 text-xl text-text_label ${value == currentTab ? 'bg-dark_blue rounded-lg' : ''}`}
            onClick={handleClick}
        >{title}</button>
    )
});

const tabArray: { title: string, value: string }[] = [
    { title: 'My Space', value: 'myspace' },
    { title: 'Dashboard', value: 'dashboard' },
];

const ProfilePage = (): React.JSX.Element | undefined => {

    const [tab, setTab] = useState<string>('myspace');

    const navigate = useNavigate();
    const { isLoading, isError, data }: UseQueryResult = useQuery({
        queryKey: ["userData"],
        queryFn: async (): Promise<User> => {
            const data: User = await api.get("/user/");
            return data
        }
    });

    const Element = () => {
        switch (tab) {
            case 'myspace':
                return <MySpace />
            case 'dashboard':
                return <MyDashboard/>

        }
    };

    useEffect(() => {
        if (!isLoading && isError)
            navigate("/");
    }, [isLoading, isError]);


    if (isLoading)
        return <h1 className="text-text_label text-2xl text-center">Loading</h1>

    else if (isError || !data)
        return <h1>Unable to load profile.</h1>


    if (isLoading)
        return <h1 className="text-lg text-text_label text-center">Loading Dashboard data</h1>

    else if (isError)
        return <h1 className="text-lg text-red-300 text-center">Error while loading dashboard data</h1>

    else if (!isLoading && !isError && data)
        return (
            <section className="flex flex-col gap-4">
                <ProfileCard {...data} />
                <div className="flex flex-row gap-4 pt-10">
                    {
                        tabArray.map((element, idx) =>
                            <TabButton
                                key={`${element.title}_${idx}`}
                                title={element.title}
                                value={element.value}
                                currentTab={tab}
                                handleClick={() => setTab(element.value)}
                            />)
                    }
                </div>
                <Element />
            </section>
        )
};

export default ProfilePage;