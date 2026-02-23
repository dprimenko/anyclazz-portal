import { Card } from "@/ui-library/components/ssr/card/Card";
import { Space } from "@/ui-library/components/ssr/space/Space";
import type { Review } from "../domain/types";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { useTranslations } from "@/i18n";


export function TeacherReview({review}: {review: Review}) {
  const t = useTranslations();

  return (
    <Card className="flex flex-col p-8">
        <div className="flex flex-row gap-1">
          {Array.from({ length: review.rating }).map((_, index) => (
            <Icon key={index} icon="star" iconWidth={20} iconHeight={20}/>
          ))}
        </div>
        <Space size={16} direction="vertical" />
        <Text size="text-md" colorType="primary">“{review.comment}”</Text>
        <Space size={32} direction="vertical" />
        <div className="flex flex-row gap-3">
          <Avatar src={review.student.avatar} alt={`${review.student.name} ${review.student.surname}`} size={48} />
          <div className="flex flex-col">
            <Text size="text-md" colorType="primary" weight="semibold">{review.student.name} {review.student.surname}</Text>
            <Text size="text-md" colorType="tertiary">{t('common.student')}</Text>
          </div>
        </div>
    </Card>
  );
}