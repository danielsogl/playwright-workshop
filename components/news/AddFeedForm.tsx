'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

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
    <Card className="bg-content1 shadow-medium" data-testid="card-add-feed">
      <CardBody>
        <form
          aria-label="Add new RSS feed form"
          className="flex flex-col md:flex-row gap-4 items-end"
          data-testid="form-add-feed"
          onSubmit={handleAddFeed}
        >
          <Input
            aria-label="Name for the new feed"
            className="flex-grow"
            data-testid="input-feed-name"
            disabled={addingFeed}
            label="Feed Name"
            labelPlacement="outside"
            placeholder="e.g., TechCrunch"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">📰</span>
              </div>
            }
            value={newFeedName}
            variant="bordered"
            onValueChange={setNewFeedName}
          />
          <Input
            aria-label="URL for the new feed"
            className="flex-grow"
            data-testid="input-feed-url"
            disabled={addingFeed}
            label="Feed URL"
            labelPlacement="outside"
            placeholder="https://example.com/feed.xml"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">🔗</span>
              </div>
            }
            type="url"
            value={newFeedUrl}
            variant="bordered"
            onValueChange={setNewFeedUrl}
          />
          <Input
            aria-label="Optional category for the new feed"
            className="flex-grow"
            data-testid="input-feed-category"
            disabled={addingFeed}
            label="Category (optional)"
            labelPlacement="outside"
            placeholder="e.g., Tech"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">📁</span>
              </div>
            }
            value={newFeedCategory}
            variant="bordered"
            onValueChange={setNewFeedCategory}
          />
          <Button
            aria-label={addingFeed ? 'Adding new feed' : 'Add new feed'}
            className="min-w-[120px]"
            color="primary"
            data-testid="btn-add-feed"
            isLoading={addingFeed}
            type="submit"
          >
            Add Feed
          </Button>
        </form>
        {feedError && (
          <p
            className="text-danger mt-2 text-small"
            data-testid="error-add-feed"
            role="alert"
          >
            {feedError}
          </p>
        )}
      </CardBody>
    </Card>
  );
};
