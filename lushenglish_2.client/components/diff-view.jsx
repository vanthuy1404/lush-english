import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DiffView({ original, corrected }) {
    const [diffLines, setDiffLines] = useState([])

    useEffect(() => {
        // Simple diff algorithm for demonstration
        const originalLines = original.split("\n")
        const correctedLines = corrected.split("\n")

        const result = []

        // This is a very simple diff - in a real app you'd want to use a proper diff library
        const maxLines = Math.max(originalLines.length, correctedLines.length)

        for (let i = 0; i < maxLines; i++) {
            if (i < originalLines.length && i < correctedLines.length) {
                if (originalLines[i] === correctedLines[i]) {
                    result.push({ text: originalLines[i], type: "unchanged" })
                } else {
                    result.push({ text: originalLines[i], type: "removed" })
                    result.push({ text: correctedLines[i], type: "added" })
                }
            } else if (i < originalLines.length) {
                result.push({ text: originalLines[i], type: "removed" })
            } else if (i < correctedLines.length) {
                result.push({ text: correctedLines[i], type: "added" })
            }
        }

        setDiffLines(result)
    }, [original, corrected])

    return (
        <ScrollArea className="h-[300px] rounded-md border p-4 bg-muted/30">
            <div className="space-y-1">
                {diffLines.map((line, index) => (
                    <div
                        key={index}
                        className={`py-1 px-2 rounded ${line.type === "added"
                                ? "bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500"
                                : line.type === "removed"
                                    ? "bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500"
                                    : ""
                            }`}
                    >
                        {line.text || "\u00A0"}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

