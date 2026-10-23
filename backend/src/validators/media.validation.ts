import { z } from 'zod';
import { Types } from 'mongoose';

const mediaUploadingSchema = z.object({
    artistName: z
    .string()
    .trim()
    .min(5, 'Artist name must be at least 5 characters long')
    .max(30, 'Artist name must be at most 30 characters long'),

    artistUserID: z
    .string()
    .trim()
    .min(1, "Artist user ID is required or should not be empty"),

    artistObjectID: z
    .string()
    .refine(
        (id) => Types.ObjectId.isValid(id),
        "Invalid artist object ID"
    ),    
    mediaType: z
    .enum(["video", "audio"]),

}).strict();

const mediaModifyingSchema = z.object({
    mediaName: z
    .string()
    .min(1, 'Media Name required')
    ,
    newMediaName: z
    .string()
    .min(1, 'New name of media required')
});

export type MediaUploadingSchema = z.infer<typeof mediaUploadingSchema>;
export type MediaModifySchema = z.infer<typeof mediaModifyingSchema>;

export { 
    mediaUploadingSchema,
    mediaModifyingSchema,
}