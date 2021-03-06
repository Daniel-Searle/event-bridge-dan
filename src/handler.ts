import {ScheduledEvent, Context, Callback} from 'aws-lambda';

export interface EventDetail {
    lastModifiedDate: string;
}

const handler = (event: ScheduledEvent<EventDetail>, _context: Context, callback: Callback): void => {
    console.log(`Function triggered with '${JSON.stringify(event)}'.`);
    let lastModifiedDate: Date;
    if (event?.detail?.lastModifiedDate) {
        try {
            lastModifiedDate = getDateFromManualTrigger(event.detail.lastModifiedDate);
        } catch (error) {
            let message = 'Failed to manually trigger function. Invalid input date is invalid';
            if (typeof error === 'string') {
                message = error;
            } else if (error instanceof Error) {
                message = error.message;
            }

            callback(new Error(message));
            return;
        }
    } else {
        const now = new Date(Date.now());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        lastModifiedDate = new Date(today.setDate(today.getDate() - 1));
        console.log(`In else: ${lastModifiedDate}`)
    }

    // getTestStations(lastModifiedDate)
    //     .then((testStations) => sendModifiedTestStations(testStations).then((response) => {
    //         const message = `Data processed successfully; good: ${response.SuccessCount}, bad: ${response.FailCount}`;
    //         logger.info(message);
    //         callback(null, message);
    //     }))
    //     .catch((error) => {
    //         logger.info('Data processed unsuccessfully.');
    //         logger.error('', error);
    //         callback(new Error('Data processed unsuccessfully.'));
    //     });
};


function getDateFromManualTrigger(lastModifiedDate: string): Date {
    const isValidDate = !Number.isNaN(Date.parse(lastModifiedDate));
    if (!isValidDate) {
        throw new Error(`Failed to manually trigger function. Invalid input date: ${lastModifiedDate}`);
    }
    return new Date(lastModifiedDate);
}

export {handler}
