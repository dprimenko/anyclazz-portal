import { Fragment } from "react";
import type { TeacherClassType } from "../../domain/types.ts";
import { Text } from "../../../../ui-library/components/ssr/text/Text.tsx";
import { Icon } from "../../../../ui-library/components/ssr/icon/Icon.tsx";
import { Divider } from "../../../../ui-library/components/ssr/divider/Divider.tsx";
import { getClassTypeIcon } from "@/features/teachers/utils/classTypeIcon.ts";
import { useTranslations } from "../../../../i18n/index.ts";
import classNames from "classnames";

export interface ClassTypesProps {
    classTypes: TeacherClassType[];
}

export function ClassTypes({ classTypes }: ClassTypesProps) {
    const t = useTranslations();

    return (
        <div className={classNames('flex flex-col w-full card p-3 rounded-lg gap-[0.625rem]')}>
            <Text colorType="primary" size="text-sm" weight="semibold">{t('teachers.class-types-pricing')}</Text>
            {classTypes.map((classType, index) => (
                <Fragment key={classType.type}>
                    <div className="flex flex-row gap-1.5">
                        <Icon icon={getClassTypeIcon(classType.type)} />
                        <Text className="flex-1" textLevel="span" colorType="primary" size="text-sm">{t(`classtype.${classType.type}`)}</Text>
                        {classType.price && (
                            <div className="flex flex-row gap-0.5 items-baseline">
                                <Text colorType="primary" textLevel="span" size="text-sm" weight="semibold">{t(`common.${classType.price?.currency.toLowerCase()}_price`, { amount: classType.price.amount })}</Text>
                                <Text colorType="primary" textLevel="span" size="text-xs">{t('common.hour')}</Text>
                            </div>
                        )}
                    </div>
                    {classTypes.length > 1 && index < classTypes.length - 1 && <Divider dotted />}
                </Fragment>
            ))}
        </div>
    );
}
