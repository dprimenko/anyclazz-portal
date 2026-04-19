import { useEffect, useState } from 'react';
import { Toast } from './Toast';
import type { ToastProps } from './types';
import { subscribe, unsubscribe } from '@/features/shared/services/domainEventsBus';
import { SharedDomainEvents } from '@/features/shared/domain/events';

export function ToastContainer() {
	const [toast, setToast] = useState<ToastProps | undefined>(undefined);

	useEffect(() => {
		const showToast = (event: CustomEvent<ToastProps>) => {
			setToast({
				message: event.detail.message,
				variant: event.detail.variant,
				autoCloseInterval: event.detail.autoCloseInterval ?? 5000,
				onClose: () => {
					setToast(undefined);
				}
			});
		};

		subscribe(SharedDomainEvents.showToast, showToast);

		return () => {
			unsubscribe(SharedDomainEvents.showToast, showToast);
		};
	}, []);

	if (!toast) return null;

	return (
		<div className="sticky top-0 left-0 right-0 w-full z-50">
			<Toast {...toast} />
		</div>
	);
}
