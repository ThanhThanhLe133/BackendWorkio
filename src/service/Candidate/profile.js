import { CandidateProfileBuilder } from '../../builder/index.js';
import supabase from '../../config/supabaseClient.js';
import { UserRepository } from '../../repository/index.js';

export const updateCandidateProfile = (id, payload) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateProfileBuilder()
            .setId(id)
            .setPayload(payload);

        const result = await builder.updateProfile();
        resolve({
            err: result ? 0 : 1,
            msg: result ? 'Successfully updated profile' : 'An error occurred, please try again later',
            response: result
        });
    } catch (error) {
        reject(error);
    }
});

export const updateCandidateAvatar = (userId, file) => new Promise(async (resolve, reject) => {
    try {
        if (!userId) return resolve({ err: 1, msg: 'Unauthorized' });
        if (!file) return resolve({ err: 1, msg: 'File is required' });

        const bucket = 'avatar';
        const ext = file.originalname?.split('.').pop() || 'png';
        const safeName = (file.originalname || `avatar.${ext}`).replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${userId}/${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

        if (uploadError) {
            return resolve({ err: 1, msg: 'Upload failed', detail: uploadError.message });
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        const publicUrl = data?.publicUrl;
        if (!publicUrl) return resolve({ err: 1, msg: 'Failed to get public URL' });

        const userRepo = new UserRepository();
        await userRepo.updateUser(userId, { avatar_url: publicUrl });

        resolve({ err: 0, msg: 'Avatar updated successfully', url: publicUrl });
    } catch (error) {
        reject(error);
    }
});