function isViewportValid(num: number) {
    if (typeof window !== 'undefined') {
        return window.innerWidth < num;
    } else {
        return false;
    }
}
export { isViewportValid }