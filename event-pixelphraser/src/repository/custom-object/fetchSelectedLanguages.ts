import { log } from 'console';
import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function fetchselectedLanguages(messageId: string): Promise<string[]> {
    try {
        const apiRoot = createApiRoot();

        logger.info(`Message ID: ${messageId} - fetching languages for translation`);

        const selectedLanguages = await apiRoot.customObjects().withContainerAndKey({
            container: "selectedLanguages",
            key: "pixelphraser"
        }).get().execute();

        let languagesForTranslation = selectedLanguages.body.value;

        if (!Array.isArray(languagesForTranslation)) {
            languagesForTranslation = Object.values(languagesForTranslation).map(String);
        }

        logger.info(`Message ID: ${messageId} - languages fetched: ${JSON.stringify(languagesForTranslation)}`);
        return languagesForTranslation;

    } catch (error: any) {
        logger.error(`Message ID: ${messageId} - failed to fetch languages`, {
            message: error.message
        });
        throw error;
    }
}

