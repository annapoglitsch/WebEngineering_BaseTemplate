import type {Bear} from './types';
import {highlightText} from "../search/HighlightText.tsx";

type BearCardProps = {
    bear: Bear;
    searchTerm: string;
};

export function BearCard({bear, searchTerm}: BearCardProps) {
    return (
        <div className="bear">
            <img
                src={bear.image}
                alt={`Image of ${bear.name}`}
                style={{width: '200px', height: 'auto'}}
            />

            <p>
                <b>{highlightText(bear.name, searchTerm)}</b> ({bear.binomial})
            </p>

            <p>{highlightText(`Range: ${bear.range ?? 'Unknown'}`, searchTerm)}</p>
        </div>
    );
}