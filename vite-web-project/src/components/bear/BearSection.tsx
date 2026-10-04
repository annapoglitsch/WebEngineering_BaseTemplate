import {useEffect, useState} from 'react';

import type {Bear} from './types';
import {fetchBears, fetchImageUrl} from './wikipedia';
import {BearList} from './BearList';
import {highlightText} from '../search/HighlightText';

type BearSectionProps = {
    searchTerm: string;
};

type BearStatus =
    | { status: 'loading' }
    | { status: 'success'; bears: Bear[] }
    | { status: 'empty' }
    | { status: 'error'; message: string };

function isValidBear(bear: Bear): boolean {
    return (
        typeof bear.name === 'string' &&
        bear.name.trim() !== '' &&
        typeof bear.binomial === 'string' &&
        bear.binomial.trim() !== '' &&
        typeof bear.fileName === 'string' &&
        bear.fileName.trim() !== ''
    );
}

export function BearSection({searchTerm}: BearSectionProps) {
    const [state, setState] = useState<BearStatus>({
        status: 'loading',
    });

    useEffect(() => {
        const controller = new AbortController();

        async function loadBears(): Promise<void> {
            setState({status: 'loading'});

            try {
                const loadedBears = await fetchBears(controller.signal);

                const validBears = loadedBears.filter(isValidBear);

                if (validBears.length === 0) {
                    setState({status: 'empty'});
                    return;
                }

                const enrichedBears = await Promise.all(
                    validBears.map(async (bear): Promise<Bear> => {
                        try {
                            const image = await fetchImageUrl(
                                bear.fileName,
                                controller.signal,
                            );

                            return {
                                ...bear,
                                image,
                            };
                        } catch (error) {
                            if (controller.signal.aborted) {
                                throw error;
                            }

                            // Keep the bear even if its image cannot be loaded.
                            return bear;
                        }
                    }),
                );

                if (controller.signal.aborted) {
                    return;
                }

                setState({
                    status: 'success',
                    bears: enrichedBears,
                });
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setState({
                    status: 'error',
                    message: 'Fehler beim Laden der Bärendaten.',
                });
            }
        }

        void loadBears();

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <section className="more-bears">
            <h2>{highlightText('More Bears', searchTerm)}</h2>

            {state.status === 'loading' && (
                <p>{highlightText('Loading bears...', searchTerm)}</p>
            )}

            {state.status === 'error' && (
                <p>{state.message}</p>
            )}

            {state.status === 'empty' && (
                <p>No bears found.</p>
            )}

            {state.status === 'success' && (
                <BearList
                    bears={state.bears}
                    searchTerm={searchTerm}
                />
            )}
        </section>
    );
}
