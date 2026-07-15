Feature: Public news feed

  Background:
    Given Nina is browsing the public news feed

  Rule: Every article is presented with enough context to judge it

    Example: The feed shows articles with a title and a source
      Then she sees at least one article
      And the first article shows a title and a source

    Example: The result count matches the articles on display
      Then the stated number of articles matches the articles shown

  Rule: Visitors can narrow the feed to what interests them

    Example: Searching narrows the feed to matching articles
      When she searches for the word from the first article's title
      Then every article shown mentions that word
