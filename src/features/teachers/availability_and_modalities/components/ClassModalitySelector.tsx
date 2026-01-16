import { useState } from "react";
import { Checkbox } from "@/ui-library/shared/checkbox";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { ClassType, type TeacherClassType, type DurationPrice } from "@/features/teachers/domain/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/i18n";
import { NumericFormat } from "react-number-format";

export interface ClassModalityOption {
    id: ClassType;
    title: string;
    description: string;
}

const getClassModalityOptions = (t: any): ClassModalityOption[] => [
    {
        id: ClassType.onlineSingle,
        title: t('teacher-profile.modality.online_single.title'),
        description: t('teacher-profile.modality.online_single.description')
    },
    {
        id: ClassType.onlineGroup,
        title: t('teacher-profile.modality.online_group.title'),
        description: t('teacher-profile.modality.online_group.description')
    },
    {
        id: ClassType.onsiteGroup,
        title: t('teacher-profile.modality.onsite_group.title'),
        description: t('teacher-profile.modality.onsite_group.description')
    },
    {
        id: ClassType.onsiteSingle,
        title: t('teacher-profile.modality.onsite_single.title'),
        description: t('teacher-profile.modality.onsite_single.description')
    }
];

export interface ClassModalitySelectorProps {
    selectedClassTypes?: TeacherClassType[];
    onChange?: (classTypes: TeacherClassType[]) => void;
}

export function ClassModalitySelector({ selectedClassTypes = [], onChange }: ClassModalitySelectorProps) {
    const t = useTranslations();
    
    // Asegurar que selectedClassTypes está bien formateado
    const validClassTypes = selectedClassTypes.filter(ct => 
        ct.type && Array.isArray(ct.durations)
    );
    
    const [classTypes, setClassTypes] = useState<TeacherClassType[]>(validClassTypes);

    const handleToggle = (modalityId: ClassType) => {
        const exists = classTypes.find(ct => ct.type === modalityId);
        
        if (exists) {
            // Deseleccionar: eliminar la modalidad
            const newClassTypes = classTypes.filter(ct => ct.type !== modalityId);
            setClassTypes(newClassTypes);
            onChange?.(newClassTypes);
        } else {
            // Seleccionar: agregar modalidad con duraciones vacías
            const newClassTypes: TeacherClassType[] = [
                ...classTypes,
                {
                    type: modalityId,
                    durations: [
                        { duration: 30 as const },
                        { duration: 60 as const }
                    ]
                }
            ];
            setClassTypes(newClassTypes);
            onChange?.(newClassTypes);
        }
    };

    const handlePriceChange = (modalityId: ClassType, duration: 30 | 60, priceAmount: number | undefined) => {
        const newClassTypes = [...classTypes];
        const classTypeIndex = newClassTypes.findIndex(ct => ct.type === modalityId);
        
        if (classTypeIndex !== -1) {
            const classType = newClassTypes[classTypeIndex];
            
            // Asegurar que durations es un array
            if (!Array.isArray(classType.durations)) {
                classType.durations = [];
            }
            
            const durationIndex = classType.durations.findIndex(d => d.duration === duration);
            
            if (priceAmount !== undefined && priceAmount > 0) {
                const durationPrice: DurationPrice = {
                    duration,
                    price: {
                        amount: priceAmount,
                        currency: 'EUR'
                    }
                };
                
                if (durationIndex !== -1) {
                    // Actualizar precio existente
                    classType.durations[durationIndex] = durationPrice;
                } else {
                    // Agregar nueva duración con precio
                    classType.durations.push(durationPrice);
                }
            } else {
                // Si el precio es undefined o 0, mantener la duración sin precio
                if (durationIndex !== -1) {
                    classType.durations[durationIndex] = { duration: duration as 30 | 60 };
                } else {
                    classType.durations.push({ duration: duration as 30 | 60 });
                }
            }
        }
        
        setClassTypes(newClassTypes);
        onChange?.(newClassTypes);
    };

    const isSelected = (modalityId: ClassType) => classTypes.some(ct => ct.type === modalityId);
    
    const getPrice = (modalityId: ClassType, duration: 30 | 60): number | undefined => {
        const classType = classTypes.find(ct => ct.type === modalityId);
        const durationPrice = classType?.durations?.find(d => d.duration === duration);
        return durationPrice?.price?.amount;
    };

    const CLASS_MODALITY_OPTIONS = getClassModalityOptions(t);
    
    return (
        <div className="flex flex-col md:flex-row gap-4 md:flex-grow-[0.25]">
            <div className="flex flex-col gap-1 w-[312px]">
                <Text textLevel="h3" size="text-sm" weight="semibold" colorType="primary">
                    {t('teacher-profile.class_modality')} <span className="text-[#F4A43A]">*</span>
                </Text>
            </div>

            <div className="flex flex-col gap-3 md:flex-grow-[0.5]">
                {CLASS_MODALITY_OPTIONS.map((option) => {
                    const checked = isSelected(option.id);
                    
                    return (
                        <div
                            key={option.id}
                            className={cn(
                                "flex flex-col gap-3 p-4 rounded-lg border-1 transition-all",
                                checked 
                                    ? "border-[#F4A43A] border-2" 
                                    : "border-[#E9EAEB] bg-white"
                            )}
                        >
                            <label className="flex items-start gap-3 cursor-pointer">
                                <Checkbox
                                    id={option.id}
                                    checked={checked}
                                    onCheckedChange={() => handleToggle(option.id)}
                                    className="mt-0.5 flex-shrink-0"
                                />
                                <div className="flex flex-col gap-1 flex-grow md:flex-grow-0 md:w-64">
                                    <Text textLevel="span" size="text-md" weight="medium" colorType="primary">
                                        {option.title}
                                    </Text>
                                    <Text textLevel="span" size="text-sm" colorType="tertiary">
                                        {option.description}
                                    </Text>
                                </div>
                            </label>

                            {/* Pricing Inputs */}
                            {checked && (
                                <div className="flex flex-col gap-3 pl-8 pt-2" suppressHydrationWarning>
                                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                                        <Text textLevel="span" size="text-md" weight="medium" colorType="primary">
                                            {t('teacher-profile.minutes_lesson', { minutes: 30 })}
                                        </Text>
                                        <div className="flex items-center gap-2">
                                            <NumericFormat
                                                value={getPrice(option.id, 30) ?? ''}
                                                onValueChange={(values) => {
                                                    handlePriceChange(option.id, 30, values.floatValue);
                                                }}
                                                placeholder={t('common.price')}
                                                className="w-32 px-3 py-2 border border-gray-200 rounded-md text-sm text-right"
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={false}
                                                thousandSeparator={false}
                                            />
                                            <Text textLevel="span" size="text-md" colorType="tertiary">
                                                €
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                                        <Text textLevel="span" size="text-md" weight="medium" colorType="primary">
                                            {t('teacher-profile.minutes_lesson', { minutes: 60 })}
                                        </Text>
                                        <div className="flex items-center gap-2">
                                            <NumericFormat
                                                value={getPrice(option.id, 60) ?? ''}
                                                onValueChange={(values) => {
                                                    handlePriceChange(option.id, 60, values.floatValue);
                                                }}
                                                placeholder={t('common.price')}
                                                className="w-32 px-3 py-2 border border-gray-200 rounded-md text-sm text-right"
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={false}
                                                thousandSeparator={false}
                                            />
                                            <Text textLevel="span" size="text-md" colorType="tertiary">
                                                €
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
