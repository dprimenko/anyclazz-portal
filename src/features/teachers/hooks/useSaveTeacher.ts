import { useState, useCallback } from 'react';
import { ApiTeacherRepository } from '../infrastructure/ApiTeacherRepository';

interface UseSaveTeacherParams {
	teacherId: string;
	token: string;
	initialSavedAt?: string | null;
	onError?: (error: Error) => void;
}

export function useSaveTeacher({ 
	teacherId, 
	token, 
	initialSavedAt,
	onError 
}: UseSaveTeacherParams) {
	const [savedAt, setSavedAt] = useState<string | null>(initialSavedAt || null);
	const [isLoading, setIsLoading] = useState(false);

	const isSaved = savedAt !== null;

	const toggleSave = useCallback(async () => {
		if (!token) {
			console.error('❌ No token provided to useSaveTeacher');
			return;
		}

		const previousSavedAt = savedAt;
		const willBeSaved = !isSaved;

		// Optimistic update
		setSavedAt(willBeSaved ? new Date().toISOString() : null);
		setIsLoading(true);

		try {
			const repository = new ApiTeacherRepository();

			if (willBeSaved) {
				await repository.saveTeacher({ token, teacherId });
			} else {
				await repository.unsaveTeacher({ token, teacherId });
			}
		} catch (error) {
			console.error('❌ Error in toggleSave:', error);
			// Revert on error
			setSavedAt(previousSavedAt);
			
			if (onError) {
				onError(error instanceof Error ? error : new Error('Failed to update saved status'));
			}
		} finally {
			setIsLoading(false);
		}
	}, [savedAt, isSaved, token, teacherId, onError]);

	return {
		isSaved,
		savedAt,
		isLoading,
		toggleSave,
	};
}
