"use client";

import { TableCell, TableFooter, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

interface TablePaginationProps {
  total: number;
  page: number;
  pageCount: number;
  goToPage: (p: number) => void;
  isLoading: boolean;
}

export default function TablePagination({
  total,
  page,
  pageCount,
  goToPage,
  isLoading,
}: TablePaginationProps) {
  const t = useTranslations("JobsTable");

  return (
    <TableFooter data-html2canvas-ignore>
      <TableRow>
        <TableCell colSpan={5}>
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {t("pagination_total")} {total}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || isLoading}
              >
                {t("pagination_prev")}
              </Button>

              {Array.from({ length: pageCount }).map((_, idx) => {
                const p = idx + 1;
                if (pageCount > 7) {
                  if (
                    p === 1 ||
                    p === pageCount ||
                    (p >= page - 2 && p <= page + 2)
                  ) {
                    return (
                      <Button
                        key={p}
                        onClick={() => goToPage(p)}
                        disabled={isLoading}
                        className={`${
                          p === page
                            ? "bg-primary text-white"
                            : "bg-transparent text-primary hover:bg-accent"
                        }`}
                      >
                        {p}
                      </Button>
                    );
                  }
                  if (p === 2 && page > 4) {
                    return (
                      <span key="dots-start">{t("pagination_dotsStart")}</span>
                    );
                  }
                  if (p === pageCount - 1 && page < pageCount - 3) {
                    return (
                      <span key="dots-end">{t("pagination_dotsEnd")}</span>
                    );
                  }
                  return null;
                }

                return (
                  <Button
                    key={p}
                    size={"sm"}
                    onClick={() => goToPage(p)}
                    className={`px-3 md:flex hidden py-1 rounded ${
                      p === page
                        ? "bg-primary text-white rounded-lg"
                        : "border bg-gray-300/30 hover:text-white text-primary rounded-lg"
                    }`}
                    disabled={isLoading}
                  >
                    {p}
                  </Button>
                );
              })}

              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => goToPage(page + 1)}
                disabled={page >= pageCount || isLoading}
              >
                {t("pagination_next")}
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
