import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const AiChatLink = ({ documentId }: { documentId: string }) => {
  return (
    <Button className="w-full" variant="outline" asChild>
      <Link href={`/dashboard/documents/${documentId}/read/askAi`}>
        <Sparkles size={14} />
        Ask AI
      </Link>
    </Button>
  );
};

export default AiChatLink;
