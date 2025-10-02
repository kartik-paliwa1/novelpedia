#!/usr/bin/env python3
"""
Script to create comprehensive tags and genres for the novel platform.
This solves the "bad request" error when users try to use non-existent tags/genres.
Includes extensive categorized lists of genres and tags commonly used in web novels.
"""

import os
import sys
import django
from django.db import transaction

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from modules.tags.models import Tag
from modules.genres.models import Genre


def create_comprehensive_genres():
    """Create comprehensive novel genres."""
    genres = [
        'Action', 'Adult', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Game', 
        'Gender Bender', 'Harem', 'Josei', 'Historical', 'Horror', 'Martial Arts', 
        'Mature', 'Mecha', 'Mystery', 'Psychological', 'Romance', 'School Life', 
        'Sci-fi', 'Seinen', 'Shoujo', 'Shounen', 'Slice of Life', 'Shounen Ai', 
        'Sports', 'Supernatural', 'Smut', 'Tragedy', 'Xianxia', 'Xuanhuan', 'Wuxia', 
        'Yaoi', 'Yuri', 'Urban Fantasy', 'Apocalypse'
    ]
    
    created_count = 0
    for genre_name in genres:
        genre, created = Genre.objects.get_or_create(name=genre_name)
        if created:
            created_count += 1
            print(f"Created genre: {genre_name}")
    
    print(f"Created {created_count} new genres out of {len(genres)} total genres")
    return created_count


def create_comprehensive_tags():
    """Create comprehensive novel tags organized by categories."""
    
    # Protagonist Traits & Roles
    protagonist_tags = [
        'Abused Characters', 'Abusive Characters', 'Aggressive Characters', 'Aloof Protagonist',
        'Average-looking Protagonist', 'Apathetic Protagonist', 'Autism', 'Bisexual Protagonist',
        'Blind Protagonist', 'Calm Protagonist', 'Carefree Protagonist', 'Charismatic Protagonist',
        'Childish Protagonist', 'Clever Protagonist', 'Cold Protagonist', 'Crazy Protagonist',
        'Cunning Protagonist', 'Curious Protagonist', 'Dense Protagonist', 'Determined Protagonist',
        'Dishonest Protagonist', 'Distrustful Protagonist', 'Egoist Protagonist', 'Emotionally Weak Protagonist',
        'Fearless Protagonist', 'Forgetful Protagonist', 'Genius Protagonist', 'Hard-Working Protagonist',
        'Honest Protagonist', 'Hot-blooded Protagonist', 'Hated Protagonist', 'Helpful Protagonist',
        'Lazy Protagonist', 'Loner Protagonist', 'Long-lived MC', 'Lucky Protagonist',
        'Manipulative Characters', 'Mature Protagonist', 'Narcissistic Protagonist', 'Naive Protagonist',
        'Pacifist Protagonist', 'Evil Protagonist', 'Perverted Protagonist', 'Talentless MC',
        'Polite Protagonist', 'Pragmatic Protagonist', 'Reckless Protagonist', 'Reluctant Protagonist',
        'Resolute Protagonist', 'Gourmet Protagonist', 'Ruthless Protagonist', 'Selfish Protagonist',
        'Selfless Protagonist', 'Shameless Protagonist', 'Smart Couple', 'Stoic Characters',
        'Stubborn Protagonist', 'Timid Protagonist', 'Trickster', 'Ugly Protagonist',
        'Unlucky Protagonist', 'Multiple Personalities', 'Multiple Identities', 'Multiple Bodies'
    ]
    
    # Romance & Relationships
    romance_tags = [
        'Adultery', 'Affair', 'Arranged Marriage', 'Beautiful Couple', 'Betrayal',
        'Bickering Couple', 'Blind Dates', 'Broken Engagement', 'Childhood Friends',
        'Childhood Love', 'Childhood Promise', 'Clingy Lover', 'Cohabitation',
        'Cold Love Interests', 'Cousins', 'Doting Parents', 'Doting Siblings',
        'Divorce', 'Engagement', 'Family Conflict', 'Forced Marriage', 'Forbidden Love',
        'Love at First Sight', 'Love Rivals', 'Love Triangles', 'Lovers Reunited',
        'Marriage of Convenience', 'Misunderstandings', 'Older Love Interests', 'Online Romance',
        'Opposite Personality Lovers', 'Persistent Love Interests', 'Pretend Lovers',
        'Protagonist Loyal to Love Interest', 'Secret Crush', 'Secret Relationship',
        'Sibling Rivalry', 'Step-siblings', 'Unrequited Love', 'Power Couple',
        'Reverse Harem', 'Harem-seeking Protagonist', 'Yandere', 'Tsundere',
        'Kuudere', 'Manly Gay Couple', 'Girls Love', 'Boys Love'
    ]
    
    # Family & Childhood
    family_tags = [
        'Abandoned Children', 'Absent Parents', 'Adopted Protagonist', 'Child Abuse',
        'Child Protagonist', 'Childcare', 'Cute Children', 'Doting Parents',
        'Familial Love', 'Family', 'Family Business', 'Famous Parents',
        'Overprotective Siblings', 'Parent Complex', 'Single Parent', 'Siblings',
        'Sister Complex', 'Brother Complex', 'Younger Brothers', 'Younger Sisters',
        'Step-family', 'Beast Companion', 'Siblings Rivalry'
    ]
    
    # Settings & Worlds
    setting_tags = [
        'Academy', 'All-Girls School', 'Amusement Park', 'Ancient Times',
        'Apartment Life', 'Antique Shop', 'Army', 'Military Bases', 'Aristocracy',
        'Court Officials', 'Clans', 'Sects', 'Empires', 'Kingdoms', 'Dystopia',
        'Eastern Setting', 'European Ambience', 'Hospitals', 'Modern Day',
        'Modern World', 'Urban Life', 'Parallel Worlds', 'Post-apocalyptic',
        'Schools', 'College', 'University', 'Battle Academy', 'High School',
        'Tribal Society', 'Urban Fantasy', 'Virtual Reality Worlds', 'World Tree',
        'World Building', 'Outer Space', 'Space Opera', 'Planets', 'Tutorial Worlds',
        'Tower Climbing', 'Infinite Regression', 'Game', 'Trials'
    ]
    
    # Supernatural & Fantasy Beings
    supernatural_tags = [
        'Angels', 'Fallen Angels', 'Demons', 'Devils', 'Evil Gods', 'Evil Religions',
        'Vampires', 'Werebeasts', 'Zombies', 'Fairies', 'Ghosts', 'Mythical Beasts',
        'Spirits', 'Yokai', 'Shikigami', 'Succubus', 'Incubus', 'Golems',
        'Goblins', 'Fox Spirits', 'Elves', 'Dwarves', 'Druids', 'Necromancers',
        'Gods', 'Goddesses', 'God-human Relationship', 'Immortals', 'Jiangshi',
        'Phoenixes', 'Valkyries', 'Outer Gods'
    ]
    
    # Power Systems & Abilities
    power_tags = [
        'Ability Steal', 'Accelerated Growth', 'Alchemy', 'Anti-Magic', 'Artifact Crafting',
        'Artifacts', 'Body Swap', 'Body Tempering', 'Blood Manipulation', 'Bloodlines',
        'Curses', 'Cultivation', 'Dao Companion', 'Dao Comprehension', 'Daoism',
        'Divine Protection', 'Elemental Magic', 'Face Slapping', 'Hidden Abilities',
        'Level System', 'Rank System', 'Level Up', 'Martial Arts', 'Martial Spirits',
        'Magic Academy', 'Magic Beasts', 'Magic Formations', 'Magic Realism',
        'Space Magic', 'Magic Technology', 'Pill Concocting', 'Luck-based Abilities',
        'Psychic Powers', 'Precognition', 'Resurrection', 'Skill Assimilation',
        'Skill Creation', 'Skill Books', 'Hero Summoning', 'Magic Summoning',
        'Spirit Summoning', 'Sword and Magic', 'Transformation', 'Time Manipulation',
        'Time Loop', 'Time Travel', 'Unique Weapons', 'Unlimited Flow',
        'System Administrator', 'Protagonist NPC', 'Talent', 'Prophecies',
        'Sealed Power', 'Monster Taming'
    ]
    
    # Technology & Sci-Fi
    technology_tags = [
        'Advanced Technology', 'Aliens', 'Androids', 'Artificial Intelligence',
        'Automatons', 'Biochip', 'Cyberpunk', 'Genetic Modifications', 'Hackers',
        'Mecha', 'Robots', 'Spaceships', 'Steampunk', 'Virtual Reality',
        'Hard Sci-fi', 'Futuristic Setting', 'Dieselpunk', 'Industrialization',
        'Technological Gap'
    ]
    
    # Occupations & Organizations
    occupation_tags = [
        'Adventurers', 'Assassins', 'Bands', 'Baseball', 'Basketball', 'Sports',
        'Butlers', 'Maids', 'Celebrities', 'Chefs', 'Detectives', 'Doctors',
        'Engineers', 'Farmers', 'Guilds', 'Healers', 'Hunters', 'Knights',
        'Lawyers', 'Mangaka', 'Merchants', 'Mercenaries', 'Musicians', 'Programmers',
        'Scientists', 'Sculptors', 'Singers', 'Spies', 'Teachers', 'Writers',
        'Businessmen', 'CEOs', 'Soldiers', 'Generals', 'Prostitutes', 'Reporters',
        'Student Council', 'Student Clubs', 'Sect Members', 'Secret Organizations',
        'Thieves', 'Pilots', 'Pirates'
    ]
    
    # Story Themes & Tropes
    theme_tags = [
        'Amnesia', 'Amoral Protagonist', 'Anti-hero Lead', 'Anti-social Protagonist',
        'Appearance Change', 'Age Change', 'Age Progression', 'Age Regression',
        'Betrayal', 'Broken Engagement', 'Bystander Protagonist', 'NPC Protagonist',
        'Childhood Promise', 'Coming of Age', 'Conspiracies', 'Contracts',
        'Cross-dressing', 'Doppelganger', 'Dreams', 'Drugs', 'Evil Organizations',
        'Experiments', 'Face Slapping', 'Forced Living Arrangements', 'Found Family',
        'Hiding Identity', 'Hiding Abilities', 'Identity Crisis', 'Inheritance',
        'Introverted Protagonist', 'Jealousy', 'Kidnappings', 'Kingdom Building',
        'Legacy', 'Long Separations', 'Lost Civilizations', 'Misunderstandings',
        'Mistaken Identity', 'Monsters', 'Monster Society', 'Multiple Worlds',
        'Multiple Timelines', 'Outcasts', 'Parallel Worlds', 'Past Trauma',
        'Power Struggle', 'Prophecies', 'Quick Transmigration', 'Redemption',
        'Regression', 'Reincarnation', 'Monster Reincarnation', 'Object Reincarnation',
        'Game Reincarnation', 'Another World Reincarnation', 'Revenge', 'Rivalry',
        'Saving the World', 'Schemes and Conspiracies', 'Secretive MC',
        'Strong to Stronger', 'Survival Game', 'Survival Themes', 'Time Paradox',
        'Transported to Another World', 'Transported to Game', 'Tragedy',
        'World Hopping', 'World Invasion', 'Wishes', 'Lottery', 'System-driven Growth'
    ]
    
    # Tone & Story Progression
    tone_tags = [
        'Character Growth', 'Character Development', 'Cliffhangers', 'Comedy Undertone',
        'Episodic', 'Fourth Wall', 'Interconnected Storylines', 'Low-key Protagonist',
        'Multiple POV', 'Multiple Protagonists', 'Slow Cultivation', 'Slow Romance',
        'Slow Growth', 'Twisted Personality', 'Tragic Past', 'Sentimental Protagonist',
        'Scheming Protagonist', 'Strong Lead', 'Sudden Strength Gain', 'Awkward Protagonist'
    ]
    
    # Mature Content Tags (kept general for moderation)
    mature_tags = [
        'R-15', 'R-18', 'Mature Themes', 'Adult Content', 'Violence', 'Gore',
        'Sexual Content', 'Explicit Content', 'Sexual Cultivation Technique'
    ]
    
    # Adaptations & References
    adaptation_tags = [
        'Adapted from Manhwa', 'Adapted from Manga', 'Adapted from Manhua',
        'Adapted from Anime', 'Adapted from Drama', 'Adapted from Game',
        'Adapted from Movie', 'Based on Movie', 'Based on Song', 'Based on TV Show',
        'Based on Game', 'Crossovers', 'Fan-fiction', 'Parody', 'References',
        'GameLit', 'LitRPG', 'Guideverse', 'SCP', 'Type-Moon', 'Vocaloid'
    ]
    
    # Miscellaneous
    misc_tags = [
        'Collection of Short Stories', 'Reader Interactive', 'Dreams',
        'Dream Auction', 'Fourth Disaster', 'Classic', 'Folklore', 'Mythology',
        'Mythos', 'Angst', 'Heartwarming', 'Grimdark', 'Satire', 'Philosophical',
        'Gothic', 'Psychological'
    ]
    
    # Combine all tags
    all_tags = (protagonist_tags + romance_tags + family_tags + setting_tags + 
               supernatural_tags + power_tags + technology_tags + occupation_tags + 
               theme_tags + tone_tags + mature_tags + adaptation_tags + misc_tags)
    
    created_count = 0
    for tag_name in all_tags:
        tag, created = Tag.objects.get_or_create(name=tag_name)
        if created:
            created_count += 1
            print(f"Created tag: {tag_name}")
    
    print(f"Created {created_count} new tags out of {len(all_tags)} total tags")
    return created_count


def main():
    """Main function to create comprehensive tags and genres."""
    print("Creating comprehensive genres and tags for the novel platform...")
    print("=" * 70)
    
    try:
        with transaction.atomic():
            print("Creating genres...")
            genres_created = create_comprehensive_genres()
            
            print("\n" + "=" * 70)
            print("Creating tags...")
            tags_created = create_comprehensive_tags()
            
        print("\n" + "=" * 70)
        print("Summary:")
        print(f"- Genres created: {genres_created}")
        print(f"- Tags created: {tags_created}")
        
        # Show current totals
        total_tags = Tag.objects.count()
        total_genres = Genre.objects.count()
        print(f"- Total tags in database: {total_tags}")
        print(f"- Total genres in database: {total_genres}")
        
        print("\nDatabase is now populated with comprehensive genres and tags!")
        print("Novel creation should work without 'bad request' errors.")
        
    except Exception as e:
        print(f"Error creating tags and genres: {e}")
        return False
    
    return True


if __name__ == "__main__":
    main()