"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
}

const LikeButton = ({ liked, onToggle }: LikeButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onToggle}
    className="flex items-center gap-1"
  >
    <Heart className={`w-4 h-4 ${liked ? "text-red-500" : ""}`} />
    {liked ? "Liked" : "Like"}
  </Button>
);

export default LikeButton;
