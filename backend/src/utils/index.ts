type ByteRange = {
    start: number,
    end: number
};

export function parseRange(
    rangeHeader: string,
    fileSize: number
): ByteRange | null {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());

    if (!match || fileSize === 0) {
        return null;
    }

    const [, startText, endText] = match;

    let start: number;
    let end: number;

    if (startText === "" && endText === "") {
        return null;
    }

    if (startText === "") {
        const suffixLength = Number(endText);

        if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
            return null;
        }

        start = Math.max(0, fileSize - suffixLength);
        end = fileSize - 1;
    } else {
        start = Number(startText);

        if (!Number.isSafeInteger(start) || start >= fileSize) {
            return null;
        }

        end = endText === "" ? fileSize - 1 : Number(endText);

        if (!Number.isSafeInteger(end) || end < start) {
            return null;
        }

        end = Math.min(end, fileSize - 1);
    }

    return { start, end };
}