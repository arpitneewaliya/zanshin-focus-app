"use client";

import React, { useState } from "react";
import { useMusicPlayerStore } from "@/stores/musicPlayerStore";
import { Track } from "@/features/music-player/data/tracks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Music, Play, Pause, Search, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrackList() {
  const {
    queue,
    currentTrack,
    isPlaying,
    isQueueOpen,
    toggleQueueOpen,
    setTrack,
    togglePlay,
  } = useMusicPlayerStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = queue.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setTrack(track, true);
    }
  };

  return (
    <Dialog open={isQueueOpen} onOpenChange={(open) => toggleQueueOpen(open)}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/60 shadow-2xl">
        <DialogHeader className="pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Music className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Music Playlist
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Select background audio for your focus session
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="pt-2 pb-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/40 border-border/40 focus-visible:ring-1"
            />
          </div>
        </div>

        <ScrollArea className="max-h-[340px] pr-3">
          <div className="space-y-1 py-1">
            {filteredTracks.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-8">
                No tracks found matching "{searchQuery}"
              </p>
            ) : (
              filteredTracks.map((track, index) => {
                const isActive = currentTrack?.id === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={cn(
                      "group flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer select-none",
                      isActive
                        ? "bg-primary/15 text-foreground font-medium"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-md flex items-center justify-center shrink-0 transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/80 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}
                      >
                        {isActive && isPlaying ? (
                          <div className="flex items-end justify-center gap-[2px] h-3.5 w-3.5">
                            <span className="w-0.5 bg-current animate-[bounce_1s_infinite_100ms] h-full rounded-full" />
                            <span className="w-0.5 bg-current animate-[bounce_1s_infinite_300ms] h-2/3 rounded-full" />
                            <span className="w-0.5 bg-current animate-[bounce_1s_infinite_200ms] h-5/6 rounded-full" />
                          </div>
                        ) : isActive ? (
                          <Pause className="h-3.5 w-3.5 fill-current" />
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-current translate-x-[0.5px]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-xs font-medium truncate leading-tight",
                            isActive && "text-primary"
                          )}
                        >
                          {track.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      <span className="text-[11px] font-mono text-muted-foreground/60">
                        #{index + 1}
                      </span>
                      {isActive && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                          <Volume2 className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
