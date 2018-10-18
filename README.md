# Plex Cleanup

After you've automated your whole Plex server setup by setting up Radarr, Sonarr and a torrent downloader, you're all set and can download any movie or TV show in a second.
**Ultimately your disks end up getting full though**. You'll remove some torrents that you've been seeding for days anyway, remove some movies that are very big etc. A few days later you see that Radarr has downloaded the same movie you've deleted again, because you've only removed it from the filesystem.

This tool intends to fix that. It very clearly shows you all the movies, TV shows and torrents that are on a given disk. You get advanced filters, can easily sort by size etc.

**Project is still in early development**

## Features

### Torrents

The tool supports Transmission. It will show you a list of your torrents with only the torrents that are safe to be removed (because they've been seeding for x days). It will show you the file size of the torrent and how much it has seeded. Torrents that are no longer registered by the tracker are also marked because you can stop seeding these. By clicking on the torrent you'll be able to remove it with its data.

### Movies

The tool will show you a list of your movies from Radarr, with the file size and quality. By clicking on the movie you'll remove it from Radarr and your file system.

### TV Shows

The tool will show you a list of your movies from Sonarr, with the file size and quality. By clicking on the show you'll remove it from Sonarr and your file system. You can expand the TV show info and see all seasons and remove individual seasons.

## Roadmap

Project is still in early development. TODO:

- Add link to Radarr in movie item (with "external" looking icon)
- Mark torrents that have been added <2 weeks with red
- Make table fixed size to prevent page jumps
- Show tooltip on "date added" with full date
- Show upload ratio on torrents
- Improve error state when delete fails
- Improve error state when fetching fails
- Add smart deletions for shows:
-- Shows (or seasons) that have not been watched for a long time and are older than e.g. one month 
- Add smart deletions dropdown
-- Delete unregistered torrents (show disk space to be cleared)
- Show amount of space freed up in notifications