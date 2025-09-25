import { driver } from "driver.js";

class Tour {

    /**
     * Create a new Tour
     * @param steps
     * @param options
     * @returns {Tour}
     */
    constructor(steps, options = {}) {

        if(steps && typeof steps !== 'object') {
            throw new Error('steps must be an array')
        }

        const confirmText = options.confirmText || 'Do you want to complete the tour?';

        this.driverObj = driver({
            showProgress: true,
            allowClose: true,
            steps,
            onDestroyStarted: () => {
                if (!this.driverObj.hasNextStep() || confirm(confirmText)) {
                    this.driverObj.destroy();
                }
            },
            onDestroyed: () => {
                localStorage.setItem(this.id, 'true');
            },
            ...options
        })

        hash(JSON.stringify(steps)).then((h) => this.id = `tour:` + h);

        return this;
    }

    /**
     * Start the tour
     * @param force {boolean} - Force start the tour
     * @returns {Tour}
     */
    start(force = false) {
        if(force || !localStorage.getItem(this.id)) {
            this.driverObj.drive();
        }
        return this;
    }

    /**
     * Restart the tour
     * Force restarts the tour
     * @returns {Tour}
     */
    restart() {
        this.start(true);
        return this;
    }

    /**
     * Clears the tour from local storage
     * @returns {Tour}
     */
    clear() {
        localStorage.removeItem(this.id);
        return this;
    }
}


function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    });
}

export default Tour;