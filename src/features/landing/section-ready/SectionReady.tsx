import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";


export function SectionReady() {
    return (
        <div className="container m-auto flex flex-col w-full px-4 py-16 md:py-24" data-testid="section-ready">
            <div className="flex flex-col items-center gap-5">
                <Text weight="semibold" textLevel="h1" className="!text-3xl md:!text-7xl !text-[#FFFDFB]" textalign="center">
                    Ready to Start Learning?
                </Text>
                <Text textalign="center" className="!text-lg md:!text-xl !text-[#FFEACF]">
                    Join thousands of students who are already achieving their goals with personalized teaching.
                </Text>
            </div>
            <div className="flex justify-center mt-11">
                <Button label="Get Started" colorType="secondary" size="lg" />
            </div>
        </div>
    );
}