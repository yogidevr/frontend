export const getSortClass = (
    sortField: string,
    field: string,
    activeClass = "text-lime-600 font-semibold",
    inactiveClass = "text-black hover:text-primary"
) => {
    return sortField === field
        ? activeClass
        : inactiveClass;
};