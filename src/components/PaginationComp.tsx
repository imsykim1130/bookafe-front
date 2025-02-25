import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import React, { useState } from 'react';

interface Props {
  currentPage: number;
  totalPages: number | undefined;
  setCurrentPage: (changePage: number) => void;
}

const pageCount = 3; // 한 번에 3개의 페이지씩 보여줌

const PaginationComp = ({ currentPage, setCurrentPage, totalPages }: Props) => {
  const [startPage, setStartPage] = useState<number>(0);
  const isNextPossible = Math.round((totalPages as number) / pageCount) - 1 > startPage;

  return (
    <Pagination className="my-[1rem]">
      <PaginationContent className="flex gap-[1rem]">
        {startPage !== 0 && (
          <i
            className="flex items-center justify-center text-sm cursor-pointer fi fi-br-angle-left"
            onClick={() => {
              setStartPage(startPage - 1);
              setCurrentPage(pageCount* startPage - 1);
            }}
          ></i>
        )}
        {Array.from({ length: pageCount }).map((_, index) => (
          <PaginationItem
            key={index}
            onClick={() => {
              setCurrentPage(startPage + index);
            }}
            className="cursor-pointer"
            hidden={startPage + index + 1 > (totalPages as number)}
          >
            <PaginationLink isActive={currentPage === startPage + index}>{startPage + index + 1}</PaginationLink>
          </PaginationItem>
        ))}
        {isNextPossible && (
          <i
            className={`flex items-center justify-center text-sm cursor-pointer fi fi-br-angle-right`}
            onClick={() => {
              setStartPage(startPage + 1);
              setCurrentPage(pageCount * (startPage + 1));
            }}
          ></i>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default React.memo(PaginationComp);
