import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { IconButton } from "@/ui-library/shared";

const subjects = [
    { name: "Languages", teachers: "15,000+", icon: "book-icon-01" },
    { name: "Mathematics", teachers: "8,500+", icon: "calculator" },
    { name: "Science", teachers: "12,000+", icon: "atom-02" },
    { name: "Social Studies", teachers: "15,000+", icon: "globe-01" },
    { name: "Arts", teachers: "4,800+", icon: "eye" },
    { name: "Music", teachers: "3,500+", icon: "music-note-01" },
    { name: "Programming", teachers: "7,200+", icon: "code-02" },
    { name: "Business", teachers: "5,900+", icon: "building-05" }
];

export function SectionExplore() {
    return (
        <div className="container m-auto flex flex-col w-full px-4 gap-12 py-16 md:py-24" data-testid="section-explore">
            <div className="flex flex-col items-center gap-4">
                <Text colorType="primary" weight="semibold" textLevel="h2" className="!text-3xl md:!text-4xl" textalign="center">
                    Students are searching for your subject right now.
                </Text>
                <Text colorType="tertiary" textalign="center" className="!text-base md:!text-lg max-w-[60ch]">
                    180+ subjects with active demand. If you teach it, there are students on Anyclazz already looking for someone like you.
                </Text>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                    <div
                        key={subject.name}
                        className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border border-gray-200 hover:border-[var(--color-primary-700)] hover:shadow-sm transition-all cursor-pointer"
                    >
                        <IconButton icon={subject.icon} iconSize={28}/>
                        <div className="flex flex-col items-center gap-1">
                            <Text colorType="primary" weight="semibold" size="text-lg">
                                {subject.name}
                            </Text>
                            <Text colorType="tertiary" size="text-md">
                                {subject.teachers} teachers
                            </Text>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-center mt-4">
                <a href="/api/auth/keycloak-register?role=teacher">
                    <Button label="Start teaching your subject" colorType="primary" size="lg" />
                </a>
            </div>
        </div>
    );
}