import Text from "@/components/interface/typography/Text";
import Button from "@/components/interface/form/Button";
import { range } from "@/utils";

type PageButtonProps = {
    current: number;
    number: number;
    onClick: () => void;
};
function PageButton({ current, number, onClick }: PageButtonProps) {
    const isCurrent = current === number;

    return (
        <Button
            className={isCurrent ? "border border-black/0" : ""}
            outlined={!isCurrent}
            color="purple"
            onClick={onClick}
        >
            {number}
        </Button>
    );
}

function PageAreaSeparator() {
    return <Text className="px-1 self-center">...</Text>;
}

export type PaginationProps = {
    currentPage: number;
    pages: number;
    onPageChange: (page: number) => void;
};
export default function Pagination({ currentPage, pages, onPageChange }: PaginationProps) {
    const viewArea = 2;

    const pageRange = range(currentPage - viewArea, currentPage + viewArea).filter(
        (x) => x > 1 && x < pages,
    );

    return (
        <div className="flex items-center">
            <div className="flex space-x-1">
                <PageButton current={currentPage} number={1} onClick={() => onPageChange(1)} />

                {pageRange[0] > 2 && <PageAreaSeparator />}

                {pages > 2 &&
                    pageRange.map((i) => {
                        return (
                            <PageButton
                                key={i}
                                current={currentPage}
                                number={i}
                                onClick={() => onPageChange(i)}
                            />
                        );
                    })}

                {pageRange[pageRange.length - 1] < pages - 1 && <PageAreaSeparator />}

                {pages > 1 && (
                    <PageButton
                        current={currentPage}
                        number={pages}
                        onClick={() => onPageChange(pages)}
                    />
                )}
            </div>
        </div>
    );
}
