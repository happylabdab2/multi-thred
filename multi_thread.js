class Thread {
    
    constructor() {
        // Ensure the browser supports Web Workers
        if (!window.Worker) {
            throw new Error("Web Workers are not supported. Use this program in a newer compatible browser.");
        }

        this._thread = null; // To store the worker instance
        this.received = null; // To store received data
    }

    /**
    * Initializes the thread by creating a new Worker
    * @param {function} workerFunction - The code to run inside the worker
    */
    init(workerFunction) {
        // Convert the function to a string and create a Blob
        const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        
        // Create a new Worker using the generated URL
        this._thread = new Worker(url);
    }

    /**
    * Sends data to the worker
    * @param {...any} data - The data to send to the worker
    */
    send(...data) {
        if (this._thread) {
            this._thread.postMessage(...data);
        }
    }

    /**
    * Receives data from the worker
    * @param {function} callback - A callback function to handle the received data
    */
    receive(callback) {
        if (this._thread) {
            this._thread.onmessage = (e) => {
                this.received = e.data;
                if (callback) {
                    callback(e.data);
                }
            };
        }
    }

    /**
    * Terminates the worker thread
    */
    terminate() {
        if (this._thread) {
            this._thread.terminate();
            this._thread = null; // Clean up the worker instance
            this.received = null;
        }
    }
}

export default Thread;
