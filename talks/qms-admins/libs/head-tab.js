"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const tabbar = new TabBar("nav");
});
class TabBar {
    /**
     * @param el CSS selector for the tab bar
     */
    constructor(el) {
        var _a, _b;
        this.el = document.querySelector(el);
        (_a = this.el) === null || _a === void 0 ? void 0 : _a.setAttribute("data-pristine", "true");
        (_b = this.el) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.switchTab.bind(this));
    }
    /**
     * Make the clicked tab active.
     * @param e Click event
     */
    switchTab(e) {
        var _a, _b;
        // allow animations, which were prevented on load
        (_a = this.el) === null || _a === void 0 ? void 0 : _a.removeAttribute("data-pristine");
        const target = e.target;
        const href = target.getAttribute("href");
        // target should be a link before assigning the “current” state
        if (href) {
            // remove the state from the current page…
            const currentPage = (_b = this.el) === null || _b === void 0 ? void 0 : _b.querySelector(`[aria-current="page"]`);
            if (currentPage) {
                currentPage.ariaCurrent = null;
            }
            // …and apply it to the next
            target.ariaCurrent = "page";
        }
    }
}