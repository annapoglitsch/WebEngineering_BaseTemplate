import {useEffect, useState} from 'react';

import type {Bear} from './types';
import {fetchBears, fetchImageUrl} from './wikipedia';
import {BearList} from './BearList';
import {highlightText} from "../search/HighlightText.tsx";

type BearSectionProps = {
    searchTerm: string;
};

export function BearSection({searchTerm}: BearSectionProps) {
    const [bears, setBears] = useState<Bear[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBears(): Promise<void> {
            try {
                const loadedBears = await fetchBears();

                const enrichedBears = await Promise.all(
                    loadedBears.map(async (bear): Promise<Bear> => {
                        try {
                            const image = await fetchImageUrl(bear.fileName);

                            return {
                                ...bear,
                                image,
                            };
                        } catch {
                            return bear;
                        }
                    }),
                );

                setBears(enrichedBears);
            } catch {
                setError('Fehler beim Laden der Bärendaten.');
            } finally {
                setLoading(false);
            }
        }

        void loadBears();
    }, []);

    if (loading) {
        return (
            <section className="more-bears">
                <h2>{highlightText('More Bears', searchTerm)}</h2>
                <p>{highlightText('Loading bears...', searchTerm)}</p>
            </section>
        );
    }

    if (error !== null) {
        return (
            <section className="more-bears">
                <h2>{highlightText('More Bears', searchTerm)}</h2>
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className="more-bears">
            <h2>{highlightText('More Bears', searchTerm)}</h2>
            <BearList bears={bears} searchTerm={searchTerm}/>
        </section>
    );
}