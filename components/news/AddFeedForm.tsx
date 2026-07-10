'use client';

import React from 'react';
import { Card, TextField, Label, Input, Button } from '@heroui/react';
import { Plus } from 'lucide-react';

interface AddFeedFormProps {
  newFeedName: string;
  setNewFeedName: (value: string) => void;
  newFeedUrl: string;
  setNewFeedUrl: (value: string) => void;
  newFeedCategory: string;
  setNewFeedCategory: (value: string) => void;
  handleAddFeed: (e: React.FormEvent) => Promise<void>;
  addingFeed: boolean;
  feedError: string | null;
}

export const AddFeedForm: React.FC<AddFeedFormProps> = ({
  newFeedName,
  setNewFeedName,
  newFeedUrl,
  setNewFeedUrl,
  newFeedCategory,
  setNewFeedCategory,
  handleAddFeed,
  addingFeed,
  feedError,
}) => {
  return (
    <Card
      className="border border-border"
      aria-label="Add new RSS feed"
    >
      <Card.Content className="p-6">
        <form
          aria-label="Add new RSS feed form"
          className="flex flex-col md:flex-row gap-4 items-end"
          onSubmit={handleAddFeed}
          name="add-feed-form"
        >
          <TextField
            aria-label="Name for the new feed"
            className="flex-grow"
            isDisabled={addingFeed}
            value={newFeedName}
            name="feed-name"
            onChange={setNewFeedName}
          >
            <Label>Feed Name</Label>
            <Input placeholder="e.g., TechCrunch" id="feed-name" />
          </TextField>
          <TextField
            aria-label="URL for the new feed"
            className="flex-grow"
            isDisabled={addingFeed}
            type="url"
            value={newFeedUrl}
            name="feed-url"
            onChange={setNewFeedUrl}
          >
            <Label>Feed URL</Label>
            <Input placeholder="https://example.com/feed.xml" id="feed-url" />
          </TextField>
          <TextField
            aria-label="Optional category for the new feed"
            className="flex-grow"
            isDisabled={addingFeed}
            value={newFeedCategory}
            name="feed-category"
            onChange={setNewFeedCategory}
          >
            <Label>Category (optional)</Label>
            <Input placeholder="e.g., Tech" id="feed-category" />
          </TextField>
          <Button
            aria-label={addingFeed ? 'Adding new feed' : 'Add new feed'}
            className="min-w-[120px] font-semibold"
            variant="primary"
            isPending={addingFeed}
            type="submit"
            id="add-feed-button"
          >
            {!addingFeed && <Plus className="w-4 h-4" aria-hidden="true" />}
            Add Feed
          </Button>
        </form>
        {feedError && (
          <div className="mt-3 p-3 bg-danger/10 text-danger border border-danger rounded-lg text-sm" role="alert">
            {feedError}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
