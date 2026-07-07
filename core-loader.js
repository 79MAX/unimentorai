export function loadCore() {
    try {
        return require('./core-v2');
    } catch (e) {
        return require('./core'); // fallback legacy
    }
}

