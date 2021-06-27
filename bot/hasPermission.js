"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasPermission(user, permission) {
    if (permission === "NONE")
        return true;
    if (user.hasPermission(permission))
        return true;
    if (user.hasPermission("ADMINISTRATOR"))
        return true;
    if (user.id === "444651464867184640")
        return true;
    return false;
}
exports.default = hasPermission;
//# sourceMappingURL=hasPermission.js.map