import { useState } from 'react';
import { useTranslations } from '@/i18n';
import { RectangleSelectionGroup, type RectangleSelectionGroupItem } from '@/ui-library/components/form/rectangle-selection-group';
import { Dropdown, type DropdownItem } from '@/ui-library/components/form/dropdown';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

interface OnboardingStep1Props {
    initialData?: {
        studentLevel?: string;
        category?: string;
        subject?: string;
    };
    onContinue: (data: { studentLevel: string; category: string; subject: string }) => void;
}

export default function OnboardingStep1({ initialData, onContinue }: OnboardingStep1Props) {
    const t = useTranslations();
    const [studentLevel, setStudentLevel] = useState<string>(initialData?.studentLevel || '');
    const [category, setCategory] = useState<string>(initialData?.category || '');
    const [subject, setSubject] = useState<string>(initialData?.subject || '');

    const studentLevelItems: RectangleSelectionGroupItem[] = [
        { id: 'kids', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.student_level.kids')}</span> },
        { id: 'high_school', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.student_level.high_school')}</span> },
        { id: 'university', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.student_level.university')}</span> },
        { id: 'adults', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.student_level.adults')}</span> },
    ];

    const categoryItems: RectangleSelectionGroupItem[] = [
        { id: 'academic_education', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.category.academic_education')}</span> },
        { id: 'sports_wellness', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.category.sports_wellness')}</span> },
        { id: 'language', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.category.language')}</span> },
        { id: 'arts_crafts_hobbies', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.category.arts_crafts_hobbies')}</span> },
        { id: 'activities_nearby', children: <span className="text-sm font-medium text-[#181d27]">{t('onboarding.category.activities_nearby')}</span> },
    ];

    const subjectItems: DropdownItem[] = [
        { 
            value: 'business_administration', 
            label: t('onboarding.subject.business_administration'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'psychology', 
            label: t('onboarding.subject.psychology'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'nursing', 
            label: t('onboarding.subject.nursing'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'biology', 
            label: t('onboarding.subject.biology'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'computer_science', 
            label: t('onboarding.subject.computer_science'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'economics', 
            label: t('onboarding.subject.economics'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'engineering', 
            label: t('onboarding.subject.engineering'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'mathematics', 
            label: t('onboarding.subject.mathematics'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'physics', 
            label: t('onboarding.subject.physics'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'chemistry', 
            label: t('onboarding.subject.chemistry'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'literature', 
            label: t('onboarding.subject.literature'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'history', 
            label: t('onboarding.subject.history'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'philosophy', 
            label: t('onboarding.subject.philosophy'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'law', 
            label: t('onboarding.subject.law'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
        { 
            value: 'medicine', 
            label: t('onboarding.subject.medicine'),
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[#F4A43A]" />}
                </div>
            )
        },
    ];

    const selectStudentLevel = (levelId: string) => {
        console.log('Selected student level:', levelId);
        setStudentLevel(levelId);
    };

    const selectCategory = (categoryId: string) => {
        console.log('Selected category:', categoryId);
        setCategory(categoryId);
    };

    const handleContinue = () => {
        onContinue({ studentLevel, category, subject });
    };

    const isFormValid = studentLevel !== '' && category !== '' && subject !== '';

    return (
        <>
            {/* Title and Description */}
            <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-[#181d27] mb-3">
                    {t('onboarding.step1.title')}
                </h1>
                <p className="text-sm text-[#717680]">
                    {t('onboarding.step1.description')}
                </p>
            </div>

            {/* Student Levels */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-3">
                    {t('onboarding.student_levels')} <span className="text-[#F4A43A]">*</span>
                </label>
                <RectangleSelectionGroup
                    items={studentLevelItems}
                    value={studentLevel}
                    onValueChange={selectStudentLevel}
                    colorType="primary"
                    cnn={{ container: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }}
                />
            </div>

            {/* Category */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[#181d27] mb-3">
                    {t('onboarding.category')} <span className="text-[#F4A43A]">*</span>
                </label>
                <RectangleSelectionGroup
                    items={categoryItems}
                    value={category}
                    onValueChange={selectCategory}
                    colorType="primary"
                />
            </div>

            {/* Subject */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[#181d27] mb-3">
                    {t('onboarding.select_main_area')} <span className="text-[#F4A43A]">*</span>
                </label>
                <Dropdown
                    items={subjectItems}
                    value={subject}
                    onChange={setSubject}
                    placeholder={t('onboarding.select_main_area')}
                    fullWidth
                />
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                disabled={!isFormValid}
                className={`
                    w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all
                    ${isFormValid
                        ? 'bg-[#F4A43A] text-white hover:bg-[#E0921F]'
                        : 'bg-[#E9EAEB] text-[#A3A7B0] cursor-not-allowed'
                    }
                `}
            >
                {t('onboarding.continue')}
            </button>
        </>
    );
}
