import { Button } from "@/components/ui/button";
import Link from "next/link";

const AiChatLink = ({ documentId }: { documentId: string }) => {
        return (
                <Button asChild>
                        <Link href="askAi">Ask AI</Link>
                </Button>
        )
}

export default AiChatLink;
