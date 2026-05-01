import { type FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { TextField } from '@/ui-library/components/form/text-field/TextField';
import { Textarea } from '@/ui-library/components/form/text-area/Textarea';
import { Checkbox } from '@/ui-library/shared/checkbox';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Button } from '@/ui-library/components/ssr/button/Button';

interface ContactFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    privacyPolicy: boolean;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const FieldLabel = ({ children, required }: { children: string; required?: boolean }) => (
    <Text textLevel="h3" weight="semibold" colorType="primary" size="text-sm">
        {children}{required && <span className="text-[var(--color-primary-700)]"> *</span>}
    </Text>
);

export const ContactForm: FC = () => {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ContactFormValues>({ defaultValues: { privacyPolicy: false } });

    const privacyPolicy = watch('privacyPolicy');

    const onSubmit = async (data: ContactFormValues) => {
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error((json as { error?: string }).error ?? 'Something went wrong');
            }

            setStatus('success');
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <Text textLevel="h3" weight="semibold" colorType="primary" size="text-xl">Message sent!</Text>
                <Text colorType="tertiary" textalign="center">
                    Thanks for reaching out. We'll get back to you as soon as possible.
                </Text>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <FieldLabel required>First name</FieldLabel>
                    <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: 'First name is required' }}
                        render={({ field }) => (
                            <TextField value={field.value} onChange={field.onChange} placeholder="First name" />
                        )}
                    />
                    {errors.firstName && (
                        <Text size="text-xs" colorType="primary" className="!text-red-500">{errors.firstName.message}</Text>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <FieldLabel required>Last name</FieldLabel>
                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: 'Last name is required' }}
                        render={({ field }) => (
                            <TextField value={field.value} onChange={field.onChange} placeholder="Last name" />
                        )}
                    />
                    {errors.lastName && (
                        <Text size="text-xs" colorType="primary" className="!text-red-500">{errors.lastName.message}</Text>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <FieldLabel required>Email</FieldLabel>
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                    }}
                    render={({ field }) => (
                        <TextField value={field.value} onChange={field.onChange} placeholder="you@company.com" type="email" />
                    )}
                />
                {errors.email && (
                    <Text size="text-xs" colorType="primary" className="!text-red-500">{errors.email.message}</Text>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <FieldLabel>Phone number</FieldLabel>
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <PatternFormat
                            format="+1 (###) ###-####"
                            mask="_"
                            value={field.value ?? ''}
                            onValueChange={(values) => field.onChange(values.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 rounded-lg border border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-2 focus:border-[var(--color-primary-700)] transition-colors"
                        />
                    )}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <FieldLabel required>Message</FieldLabel>
                <Controller
                    name="message"
                    control={control}
                    rules={{ required: 'Message is required' }}
                    render={({ field }) => (
                        <Textarea value={field.value} onChange={field.onChange} placeholder="Leave us a message..." rows={5} />
                    )}
                />
                {errors.message && (
                    <Text size="text-xs" colorType="primary" className="!text-red-500">{errors.message.message}</Text>
                )}
            </div>

            <div className="flex items-start gap-2.5">
                <Checkbox
                    id="privacyPolicy"
                    checked={privacyPolicy}
                    onCheckedChange={(checked) => setValue('privacyPolicy', checked === true, { shouldValidate: true })}
                />
                <label htmlFor="privacyPolicy" className="text-sm text-[var(--color-neutral-600)] leading-5 cursor-pointer">
                    You agree to our friendly{' '}
                    <a href="/legal/privacy-policy" className="!underline text-[var(--color-neutral-900)] hover:text-[var(--color-primary-700)] transition-colors">
                        privacy policy
                    </a>
                    .
                </label>
            </div>

            {status === 'error' && (
                <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <Text size="text-sm" className="text-red-600">{errorMessage}</Text>
                </div>
            )}

            <Button
                type="submit"
                label="Send message"
                colorType="primary"
                size="lg"
                fullWidth
                isLoading={status === 'loading'}
                disabled={status === 'loading' || !privacyPolicy}
            />
        </form>
    );
};
