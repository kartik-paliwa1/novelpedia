# Welcome to the serializers file for our 'novel' module!
# This is where we work our magic to transform our novel data into a format that's perfect for our API.
# It's like being a master chef, preparing the data just right for our frontend to enjoy! 🍽️

from rest_framework import serializers
from modules.tags.models import Tag
from modules.genres.models import Genre
from .models import Novel, FeaturedNovel, Bookmark

# --- The Novel List Serializer: A sneak peek of our novels! ---
# This serializer is for listing novels. It's a lightweight version of the full novel serializer,
# perfect for showing a list of novels without overwhelming the user with too much information.
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


class NovelListSerializer(serializers.ModelSerializer):
    primary_genre = GenreSerializer(read_only=True, help_text="Primary genre details for quick display.")

    class Meta:
        model = Novel
        # We're only including the essential fields for a list view.
        fields = [
            'id',
            'title',
            'slug',
            'cover_image',
            'views',
            'rating',
            'last_updated',
            'status',
            'primary_genre',
            'language',
        ]

# --- The Novel Serializer: The full story! ---
# This serializer is for viewing a single novel. It includes all the juicy details.
class NovelSerializer(serializers.ModelSerializer):
    # We're using dedicated serializers to show friendly tag and genre data.
    tags = TagSerializer(many=True, read_only=True, help_text="The tags associated with the novel.")
    genres = GenreSerializer(many=True, read_only=True, help_text="The genres of the novel.")
    primary_genre = GenreSerializer(read_only=True, help_text="The headline genre for the novel.")

    class Meta:
        model = Novel
        # We're including all the fields from our Novel model.
        fields = [
            'id',
            'title',
            'slug',
            'synopsis',
            'short_synopsis',
            'author',
            'cover_image',
            'cover_image_large',
            'collections',
            'likes',
            'views',
            'reviews_count',
            'rating',
            'created_at',
            'last_updated',
            'tags',
            'genres',
            'primary_genre',
            'status',
            'target_audience',
            'language',
            'update_schedule',
            'planned_length',
            'maturity_rating',
        ]

class NovelWriteSerializer(serializers.ModelSerializer):
    # Accept both IDs and names for backward compatibility and auto-creation
    primary_genre_id = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        source='primary_genre',
        allow_null=True,
        required=False,
        write_only=True,
        help_text="Select the headline genre for this novel."
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
        source='tags',
        write_only=True,
        help_text="List of tag IDs to associate with this novel."
    )
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        required=False,
        source='genres',
        write_only=True,
        help_text="List of supporting genre IDs for broader discovery."
    )
    
    # New fields that accept names and auto-create missing entries
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        write_only=True,
        help_text="List of tag names - will auto-create if they don't exist."
    )
    genre_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        write_only=True,
        help_text="List of genre names - will auto-create if they don't exist."
    )
    primary_genre_name = serializers.CharField(
        max_length=50,
        required=False,
        write_only=True,
        help_text="Primary genre name - will auto-create if it doesn't exist."
    )

    class Meta:
        model = Novel
        fields = [
            'id',
            'slug',
            'title',
            'synopsis',
            'short_synopsis',
            'status',
            'target_audience',
            'language',
            'update_schedule',
            'planned_length',
            'maturity_rating',
            'cover_image',
            'cover_image_large',
            'primary_genre_id',
            'tag_ids',
            'genre_ids',
            'tag_names',
            'genre_names',
            'primary_genre_name',
        ]
        read_only_fields = ['id', 'slug']

    def validate_title(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        queryset = Novel.objects.filter(title__iexact=value)
        if user and user.is_authenticated:
            queryset = queryset.filter(author=user)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("You already have a novel with this title. Please choose another.")
        return value

    def _get_or_create_tags_from_names(self, tag_names):
        """Create tags if they don't exist and return list of Tag instances."""
        tags = []
        for name in tag_names:
            name = name.strip()
            if name:  # Only process non-empty names
                tag, created = Tag.objects.get_or_create(name=name)
                tags.append(tag)
        return tags
    
    def _get_or_create_genres_from_names(self, genre_names):
        """Create genres if they don't exist and return list of Genre instances."""
        genres = []
        for name in genre_names:
            name = name.strip()
            if name:  # Only process non-empty names
                genre, created = Genre.objects.get_or_create(name=name)
                genres.append(genre)
        return genres
    
    def _get_or_create_primary_genre_from_name(self, genre_name):
        """Create primary genre if it doesn't exist and return Genre instance."""
        if not genre_name or not genre_name.strip():
            return None
        genre, created = Genre.objects.get_or_create(name=genre_name.strip())
        return genre

    def _apply_short_synopsis_default(self, validated_data):
        synopsis = validated_data.get('synopsis')
        short_synopsis = validated_data.get('short_synopsis')
        if synopsis and not short_synopsis:
            validated_data['short_synopsis'] = synopsis[:500]

    def create(self, validated_data):
        request = self.context['request']
        user = request.user
        
        # Handle ID-based associations (existing behavior)
        tags = validated_data.pop('tags', [])
        genres = validated_data.pop('genres', [])
        
        # Handle name-based associations (new auto-creation behavior)
        tag_names = validated_data.pop('tag_names', [])
        genre_names = validated_data.pop('genre_names', [])
        primary_genre_name = validated_data.pop('primary_genre_name', None)
        
        # Auto-create tags and genres from names
        if tag_names:
            new_tags = self._get_or_create_tags_from_names(tag_names)
            tags.extend(new_tags)
            
        if genre_names:
            new_genres = self._get_or_create_genres_from_names(genre_names)
            genres.extend(new_genres)
            
        if primary_genre_name and 'primary_genre' not in validated_data:
            validated_data['primary_genre'] = self._get_or_create_primary_genre_from_name(primary_genre_name)

        self._apply_short_synopsis_default(validated_data)

        novel = Novel.objects.create(author=user, **validated_data)
        if tags:
            novel.tags.set(tags)
        if genres:
            novel.genres.set(genres)
        return novel

    def update(self, instance, validated_data):
        # Handle ID-based associations (existing behavior)
        tags = validated_data.pop('tags', None)
        genres = validated_data.pop('genres', None)
        
        # Handle name-based associations (new auto-creation behavior)
        tag_names = validated_data.pop('tag_names', None)
        genre_names = validated_data.pop('genre_names', None)
        primary_genre_name = validated_data.pop('primary_genre_name', None)
        
        # Auto-create tags and genres from names
        if tag_names is not None:
            new_tags = self._get_or_create_tags_from_names(tag_names)
            if tags is None:
                tags = []
            tags.extend(new_tags)
            
        if genre_names is not None:
            new_genres = self._get_or_create_genres_from_names(genre_names)
            if genres is None:
                genres = []
            genres.extend(new_genres)
            
        if primary_genre_name and 'primary_genre' not in validated_data:
            validated_data['primary_genre'] = self._get_or_create_primary_genre_from_name(primary_genre_name)

        self._apply_short_synopsis_default(validated_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags is not None:
            instance.tags.set(tags)
        if genres is not None:
            instance.genres.set(genres)
        return instance

# --- The Featured Novel Serializer: In the spotlight! ---
# This serializer is for featuring novels. It's for shining a spotlight on the best of the best.
class FeaturedNovelSerializer(serializers.ModelSerializer):
    # We're using the `NovelSerializer` to show the full details of the featured novel.
    novel = NovelSerializer(read_only=True)
    # We're also including a `novel_id` field so we can easily feature a novel by its ID.
    novel_id = serializers.PrimaryKeyRelatedField(
        queryset=Novel.objects.all(), source='novel', write_only=True, help_text="The ID of the novel to be featured."
    )

    class Meta:
        model = FeaturedNovel
        fields = ['id', 'novel', 'novel_id', 'featured_at', 'is_active']

# --- The Bookmark Serializer: Don't lose your page! ---
# This serializer is for bookmarking novels. It's for when a user wants to save a novel for later.
class BookmarkSerializer(serializers.ModelSerializer):
    # We're including the novel's title to make the bookmark more informative.
    novel_title = serializers.CharField(source="novel.title", read_only=True, help_text="The title of the bookmarked novel.")

    class Meta:
        model = Bookmark
        fields = ['id', 'novel', 'novel_title', 'created_at']

# And that's a wrap on our novel serializers! They're all set to translate our novel data
# and make our API a joy to use. Now, let's see them in action in our views! 🎬
