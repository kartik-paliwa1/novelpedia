"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/services/api";
import type { Genre, Tag } from "@/services/api";
import { clearAuthTokens, isLoggedIn } from "@/utils/auth";
import { CoverImageUpload } from "@/components/ui/cover-image-upload";
// Comprehensive genres and tags are now loaded from the database
// No need for hardcoded lists since we populate the DB with comprehensive data

const STEPS = [
  { title: "Story", description: "Title and synopsis" },
  { title: "Planning", description: "Publishing preferences" },
  { title: "Categories", description: "Genres and tags" },
  { title: "Artwork", description: "Cover images" },
  { title: "Review", description: "Confirm details" },
] as const;

const STATUS_OPTIONS = ["Ongoing", "Completed"] as const;
const CONTENT_TYPE_OPTIONS = ["Original", "Fanfic"] as const;
const LANGUAGE_SUGGESTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Indonesian",
  "Thai",
];
const PLANNED_LENGTH_SUGGESTIONS = [
  "Short Story (< 10k words)",
  "Novella (10k - 40k words)",
  "Novel (40k+ words)",
];
const MATURITY_RATING_OPTIONS = ["General", "PG-13", "Adult"] as const;

const MAX_TAG_SELECTION = 6;
const MAX_ADDITIONAL_GENRES = 1;

const COVER_MAX = 5 * 1024 * 1024;

const TAG_LIMIT_ERROR = `You can select up to ${MAX_TAG_SELECTION} tags.`;
const GENRE_LIMIT_ERROR = "Select exactly one supporting genre.";

// Genre and tag ordering is now handled by the API response
// The database contains comprehensive, properly ordered data

export type WizardMode = "create" | "edit";

type CreationFormState = {
  title: string;
  synopsis: string;
  short_synopsis: string;
  status: (typeof STATUS_OPTIONS)[number];
  content_type: (typeof CONTENT_TYPE_OPTIONS)[number];
  language: string;
  planned_length: string;
  maturity_rating: (typeof MATURITY_RATING_OPTIONS)[number];
  primary_genre_id: number | null;
  genre_ids: number[];
  tag_ids: number[];
};

const createInitialFormState = (): CreationFormState => ({
  title: "",
  synopsis: "",
  short_synopsis: "",
  status: STATUS_OPTIONS[0],
  content_type: CONTENT_TYPE_OPTIONS[0],
  language: LANGUAGE_SUGGESTIONS[0],
  planned_length: "",
  maturity_rating: MATURITY_RATING_OPTIONS[0],
  primary_genre_id: null,
  genre_ids: [],
  tag_ids: [],
});

const revokePreviewUrl = (url: string | null) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

export interface NovelSetupWizardProps {
  initialMode?: WizardMode;
  prefillSlug?: string | null;
}

export function NovelSetupWizard({ initialMode, prefillSlug }: NovelSetupWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchParamValue = searchParams?.get("edit") ?? searchParams?.get("slug") ?? null;
  const decodedSearchSlug = searchParamValue ? decodeURIComponent(searchParamValue) : null;
  const effectivePrefillSlug = prefillSlug ?? decodedSearchSlug;

  const startingMode: WizardMode = initialMode ?? (effectivePrefillSlug ? "edit" : "create");

  const [mode, setMode] = useState<WizardMode>(startingMode);
  const [editSlug, setEditSlug] = useState<string | null>(effectivePrefillSlug);
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(effectivePrefillSlug);
  const [novelId, setNovelId] = useState<number | null>(null);
  const [isLoadingNovel, setIsLoadingNovel] = useState<boolean>(Boolean(effectivePrefillSlug));

  const isEditMode = mode === "edit";

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreationFormState>(() => createInitialFormState());
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [coverPublicId, setCoverPublicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  useEffect(() => {
    const enforceAuth = async () => {
      const authenticated = await isLoggedIn();
      if (!authenticated) {
        clearAuthTokens();
        router.push("/login");
      }
    };

    void enforceAuth();
  }, [router]);

  const loadMetadata = useCallback(async () => {
    setMetadataLoading(true);
    setMetadataError(null);

    try {
      // Fetch all genres and tags from the backend API (now comprehensively populated)
      const [genresResponse, tagsResponse] = await Promise.all([
        api.getGenres({ ordering: "name" }),
        api.getTags({ ordering: "name" }),
      ]);

      const rawGenres = Array.isArray(genresResponse.data)
        ? (genresResponse.data as Genre[])
        : [];
      
      const rawTags = Array.isArray(tagsResponse.data) 
        ? (tagsResponse.data as Tag[]) 
        : [];

      // Use all genres from the database (now comprehensive)
      const validGenres = rawGenres.filter((genre) => 
        genre && typeof genre.name === "string" && genre.name.trim().length > 0
      );

      // Use all tags from the database (now comprehensive)  
      const validTags = rawTags.filter((tag) => 
        tag && typeof tag.name === "string" && tag.name.trim().length > 0
      );

      // Sort alphabetically since we have comprehensive data
      const orderedGenres = validGenres.sort((a, b) => 
        (a.name ?? "").localeCompare(b.name ?? "")
      );

      const orderedTags = validTags.sort((a, b) => 
        (a.name ?? "").localeCompare(b.name ?? "")
      );

      setGenres(orderedGenres);
      setTags(orderedTags);

      console.log(`Loaded ${orderedGenres.length} genres and ${orderedTags.length} tags from API`);
    } catch (error) {
      console.error("Failed to load novel metadata", error);
      setMetadataError("We could not load genres and tags. Please try again.");
    } finally {
      setMetadataLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMetadata();
  }, [loadMetadata]);

  useEffect(
    () => () => {
      revokePreviewUrl(coverPreview);
    },
    [coverPreview]
  );

  useEffect(
    () => () => {
    },
  );

  useEffect(() => {
    if (effectivePrefillSlug) {
      setMode("edit");
      setEditSlug(effectivePrefillSlug);
      setResolvedSlug(effectivePrefillSlug);
      setIsLoadingNovel(true);
    } else {
      setMode(initialMode ?? "create");
      setEditSlug(null);
      setResolvedSlug(null);
      setNovelId(null);
      setForm(createInitialFormState());
      setStep(0);
      setErrMsg(null);
      setIsLoadingNovel(false);
      setExistingCoverUrl(null);
      setCoverImage(null);
      setCoverPreview((previous) => {
        revokePreviewUrl(previous);
        return null;
      });
    }
  }, [effectivePrefillSlug, initialMode]);

  useEffect(() => {
    if (!editSlug) {
      return;
    }

    let cancelled = false;

    const loadNovelDetails = async () => {
      setIsLoadingNovel(true);
      try {
        const response = await api.getAuthorNovelDetail(editSlug);
        if (cancelled) {
          return;
        }

        const novel = (response?.data ?? null) as any;
        if (!novel) {
          setErrMsg("We couldn't load that novel for editing.");
          return;
        }

        const sanitizeGenreId = (candidate: any): number | null => {
          const value = Number(candidate?.id ?? candidate?.pk ?? candidate);
          if (!Number.isFinite(value)) {
            return null;
          }
          // Accept any valid genre from the database
          return value;
        };

        const sanitizeTagId = (candidate: any): number | null => {
          const value = Number(candidate?.id ?? candidate?.pk ?? candidate);
          if (!Number.isFinite(value)) {
            return null;
          }
          // Accept any valid tag from the database
          return value;
        };

        const primaryRaw = novel.primary_genre ?? null;
        const primaryGenreId = sanitizeGenreId(primaryRaw);

        const supportingGenres = Array.isArray(novel.genres)
          ? novel.genres
              .map((item: any) => sanitizeGenreId(item))
              .filter((value: number | null): value is number => value !== null && value !== primaryGenreId)
          : [];
        const limitedSupportingGenres = supportingGenres.slice(0, MAX_ADDITIONAL_GENRES);

        const tagIds = Array.isArray(novel.tags)
          ? novel.tags
              .map((item: any) => sanitizeTagId(item))
              .filter((value: number | null): value is number => value !== null)
          : [];

        const candidateStatus = typeof novel.status === "string" ? novel.status : "";
        const status = STATUS_OPTIONS.includes(
          candidateStatus as (typeof STATUS_OPTIONS)[number]
        )
          ? (candidateStatus as (typeof STATUS_OPTIONS)[number])
          : STATUS_OPTIONS[0];

        const candidateContentType =
          typeof novel.content_type === "string" ? novel.content_type : "";
        const contentType = CONTENT_TYPE_OPTIONS.includes(
          candidateContentType as (typeof CONTENT_TYPE_OPTIONS)[number]
        )
          ? (candidateContentType as (typeof CONTENT_TYPE_OPTIONS)[number])
          : CONTENT_TYPE_OPTIONS[0];

        const candidateMaturity =
          typeof novel.maturity_rating === "string" ? novel.maturity_rating : "";
        const maturityRating = MATURITY_RATING_OPTIONS.includes(
          candidateMaturity as (typeof MATURITY_RATING_OPTIONS)[number]
        )
          ? (candidateMaturity as (typeof MATURITY_RATING_OPTIONS)[number])
          : MATURITY_RATING_OPTIONS[0];

        setForm({
          title: novel.title ?? "",
          synopsis: novel.synopsis ?? novel.description ?? "",
          short_synopsis: novel.short_synopsis ?? "",
          status,
          content_type: contentType,
          language:
            typeof novel.language === "string" && novel.language.length
              ? novel.language
              : LANGUAGE_SUGGESTIONS[0],
          planned_length: novel.planned_length ?? "",
          maturity_rating: maturityRating,
          primary_genre_id: Number.isFinite(primaryGenreId ?? NaN)
            ? (primaryGenreId as number)
            : null,
          genre_ids: limitedSupportingGenres,
          tag_ids: tagIds,
        });

        const numericId = Number(novel.id);
        setNovelId(Number.isFinite(numericId) ? numericId : null);
        const resolved =
          typeof novel.slug === "string" && novel.slug.length ? novel.slug : editSlug;
        setResolvedSlug(resolved);

        setExistingCoverUrl(
          typeof novel.cover_image === "string" && novel.cover_image.length
            ? novel.cover_image
            : typeof novel.cover === "string" && novel.cover.length
            ? novel.cover
            : null
        );

        setCoverImage(null);
        setCoverPreview((previous) => {
          revokePreviewUrl(previous);
          return null;
        });

        setErrMsg(null);
        setStep(0);
        setMode("edit");
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load novel details", error);
          setErrMsg("We couldn't load that novel for editing.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingNovel(false);
        }
      }
    };

    void loadNovelDetails();

    return () => {
      cancelled = true;
    };
  }, [editSlug]);

  const progress = useMemo(() => (step / (STEPS.length - 1)) * 100, [step]);
  const isLastStep = step === STEPS.length - 1;
  const isFirstStep = step === 0;

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errMsg === TAG_LIMIT_ERROR || errMsg === GENRE_LIMIT_ERROR) {
      return;
    }
    if (name === "title" || name === "synopsis" || name === "short_synopsis") {
      setErrMsg(null);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, status: event.target.value as (typeof STATUS_OPTIONS)[number] }));
  };

  const handleContentTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, content_type: event.target.value as (typeof CONTENT_TYPE_OPTIONS)[number] }));
  };

  const handleMaturityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, maturity_rating: event.target.value as (typeof MATURITY_RATING_OPTIONS)[number] }));
  };

  const handlePrimaryGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const nextPrimary = value ? Number(value) : null;

    setForm((prev) => ({
      ...prev,
      primary_genre_id: Number.isNaN(nextPrimary) ? null : nextPrimary,
      genre_ids: prev.genre_ids.filter((id) => id !== nextPrimary),
    }));

    if (errMsg && errMsg.includes("primary genre")) {
      setErrMsg(null);
    }
  };

  const handleSupportingGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const genreId = value ? Number(value) : null;
    if (!genreId || Number.isNaN(genreId)) {
      setForm((prev) => ({ ...prev, genre_ids: [] }));
    } else {
      setForm((prev) => ({ ...prev, genre_ids: [genreId] }));
    }
    if (errMsg === GENRE_LIMIT_ERROR) {
      setErrMsg(null);
    }
  };

  const toggleAdditionalGenre = (genreId: number) => {
    if (form.genre_ids.includes(genreId)) {
      const nextGenres = form.genre_ids.filter((id) => id !== genreId);
      setForm((prev) => ({ ...prev, genre_ids: nextGenres }));
      return;
    }

    setForm((prev) => ({ ...prev, genre_ids: [genreId] }));
    if (errMsg === GENRE_LIMIT_ERROR) {
      setErrMsg(null);
    }
  };

  const toggleTag = (tagId: number) => {
    if (form.tag_ids.includes(tagId)) {
      const nextTags = form.tag_ids.filter((id) => id !== tagId);
      setForm((prev) => ({ ...prev, tag_ids: nextTags }));
      if (errMsg === TAG_LIMIT_ERROR && nextTags.length < MAX_TAG_SELECTION) {
        setErrMsg(null);
      }
      return;
    }

    if (form.tag_ids.length >= MAX_TAG_SELECTION) {
      setErrMsg(TAG_LIMIT_ERROR);
      return;
    }

    setForm((prev) => ({ ...prev, tag_ids: [...prev.tag_ids, tagId] }));
    if (errMsg === TAG_LIMIT_ERROR) {
      setErrMsg(null);
    }
  };

  // Cover image handling is now done by the CoverImageUpload component

  const getValidationError = (currentStep: number): string | null => {
    if (currentStep === 0) {
      if (!form.title.trim()) {
        return "Title is required.";
      }
      if (!form.synopsis.trim()) {
        return "Synopsis is required.";
      }
      return null;
    }

    if (currentStep === 2) {
      if (!form.primary_genre_id) {
        return "Please choose a primary genre.";
      }
      if (form.genre_ids.length !== MAX_ADDITIONAL_GENRES) {
        return GENRE_LIMIT_ERROR;
      }
      return null;
    }

    if (currentStep === 3) {
      const hasCover = Boolean(existingCoverUrl);
      if (!hasCover) {
        return "Please add a cover image.";
      }
      return null;
    }

    return null;
  };

  const validateStep = (currentStep: number) => {
    const error = getValidationError(currentStep);
    if (error) {
      setErrMsg(error);
      return false;
    }
    setErrMsg(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setErrMsg(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLastStep) {
      handleNext();
      return;
    }

    for (let index = 0; index < STEPS.length; index += 1) {
      const error = getValidationError(index);
      if (error) {
        setErrMsg(error);
        setStep(index);
        return;
      }
    }

    setErrMsg(null);
    setLoading(true);

    try {
      const combinedGenreIds = form.primary_genre_id
        ? Array.from(new Set([form.primary_genre_id, ...form.genre_ids]))
        : [...form.genre_ids];

      // Get names for tags and genres from the available lists (which include fallbacks)
      const selectedTags = availableTags.filter(tag => form.tag_ids.includes(tag.id));
      const selectedGenres = availableGenres.filter(genre => combinedGenreIds.includes(genre.id));
      const primaryGenre = availableGenres.find(genre => genre.id === form.primary_genre_id);

      // Extract genre and tag names for the backend
      const primaryGenreName = primaryGenre?.name;
      const genreNames = selectedGenres.map(genre => genre.name);
      const tagNames = selectedTags.map(tag => tag.name);

      const payload = {
        title: form.title.trim(),
        synopsis: form.synopsis.trim(),
        short_synopsis: form.short_synopsis.trim() || undefined,
        status: form.status || undefined,
        target_audience: form.content_type || undefined, // Fix: backend expects target_audience, not content_type
        language: form.language.trim() || undefined,
        planned_length: form.planned_length.trim() || undefined,
        maturity_rating: form.maturity_rating || undefined,
        // Use names instead of IDs for auto-creation
        primary_genre_name: primaryGenreName,
        genre_names: genreNames.filter(Boolean),
        tag_names: tagNames.filter(Boolean),
        // Note: cover_image is uploaded separately via CoverImageUpload component
        // Don't include it here as the backend expects it as a file upload, not a URL
      };

      if (isEditMode) {
        const slugToUpdate = editSlug ?? resolvedSlug ?? effectivePrefillSlug;
        if (!slugToUpdate) {
          throw new Error("We could not determine which novel to update.");
        }

        const response = await api.updateNovel(slugToUpdate, payload);
        const updatedProject = response.data;
        const resultingSlug = updatedProject.slug ?? resolvedSlug ?? slugToUpdate;

        window.alert("Novel updated successfully!");
        router.push(`/dashboard/editor/${resultingSlug}`);
        return;
      }

      const creationResponse = await api.createNovel(payload);
      const novel = creationResponse.data as { id?: number; slug?: string };
      if (!novel?.id) {
        throw new Error("Novel creation failed. Please try again.");
      }

      window.alert("Novel created successfully!");
      if (novel.slug) {
        router.push(`/dashboard/editor/${novel.slug}`);
      } else {
        router.push("/dashboard/editor");
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
          ? error.message
          : null;

      setErrMsg(message || (isEditMode ? "Failed to update novel." : "Failed to create novel."));
      if (error instanceof ApiError && error.status === 401) {
        clearAuthTokens();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const availableGenres = useMemo(() => genres, [genres]);

  const availableTags = useMemo(() => tags, [tags]);

  const selectedPrimaryGenre = useMemo(
    () => availableGenres.find((genre) => genre.id === form.primary_genre_id) ?? null,
    [availableGenres, form.primary_genre_id]
  );

  const selectedGenres = useMemo(
    () => availableGenres.filter((genre) => form.genre_ids.includes(genre.id)),
    [availableGenres, form.genre_ids]
  );

  const filteredTags = useMemo(() => {
    const normalizedQuery = tagSearch.trim().toLowerCase();
    if (!normalizedQuery) {
      return availableTags;
    }
    return availableTags.filter((tag) => tag.name.toLowerCase().includes(normalizedQuery));
  }, [availableTags, tagSearch]);

  const selectedTags = useMemo(
    () => availableTags.filter((tag) => form.tag_ids.includes(tag.id)),
    [availableTags, form.tag_ids]
  );

  // Display cover image from Cloudinary (uploaded via CoverImageUpload component)
  const displayCoverImage = existingCoverUrl;

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="novel-title" className="block text-violet-200 text-xs mb-1">
                Title<span className="text-red-400 ml-1">*</span>
              </label>
              <input
                id="novel-title"
                name="title"
                value={form.title}
                onChange={handleTextChange}
                required
                className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                placeholder="Enter novel title"
              />
            </div>

            <div>
              <label htmlFor="novel-short-synopsis" className="block text-violet-200 text-xs mb-1">
                Synopsis Abbreviation
              </label>
              <p className="text-[11px] text-violet-300/80 mb-2">
                Keep it short and memorable. Example: LoDR - Legacy of Dragon Riders.
              </p>
              <textarea
                id="novel-short-synopsis"
                name="short_synopsis"
                value={form.short_synopsis}
                onChange={handleTextChange}
                maxLength={120}
                rows={2}
                className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none resize-none"
                placeholder='E.g., "LoDR - Legacy of Dragon Riders"'
              />
            </div>

            <div>
              <label htmlFor="novel-synopsis" className="block text-violet-200 text-xs mb-1">
                Synopsis<span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                id="novel-synopsis"
                name="synopsis"
                value={form.synopsis}
                onChange={handleTextChange}
                className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus-ring-violet-400 outline-none min-h-[160px]"
                placeholder="Share the core conflict, main characters, and world of your story"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="novel-status" className="block text-violet-200 text-xs mb-1">
                  Status
                </label>
                <select
                  id="novel-status"
                  name="status"
                  value={form.status}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="novel-language" className="block text-violet-200 text-xs mb-1">
                  Language
                </label>
                <input
                  id="novel-language"
                  name="language"
                  value={form.language}
                  onChange={handleTextChange}
                  list="wizard-language-suggestions"
                  className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                  placeholder="Primary language of your story"
                />
                <datalist id="wizard-language-suggestions">
                  {LANGUAGE_SUGGESTIONS.map((language) => (
                    <option key={language} value={language} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="novel-content-type" className="block text-violet-200 text-xs mb-1">
                  Content type
                </label>
                <select
                  id="novel-content-type"
                  name="content_type"
                  value={form.content_type}
                  onChange={handleContentTypeChange}
                  className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                >
                  {CONTENT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="novel-maturity" className="block text-violet-200 text-xs mb-1">
                  Maturity rating
                </label>
                <select
                  id="novel-maturity"
                  name="maturity_rating"
                  value={form.maturity_rating}
                  onChange={handleMaturityChange}
                  className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                >
                  {MATURITY_RATING_OPTIONS.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="novel-length" className="block text-violet-200 text-xs mb-1">
                  Planned length
                </label>
                <input
                  id="novel-length"
                  name="planned_length"
                  value={form.planned_length}
                  onChange={handleTextChange}
                  list="wizard-planned-length-suggestions"
                  className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                  placeholder="How long will this story be?"
                />
                <datalist id="wizard-planned-length-suggestions">
                  {PLANNED_LENGTH_SUGGESTIONS.map((length) => (
                    <option key={length} value={length} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="primary-genre" className="block text-violet-200 text-xs mb-1">
                Primary genre
              </label>
              <select
                id="primary-genre"
                name="primary_genre_id"
                value={form.primary_genre_id ?? ""}
                onChange={handlePrimaryGenreChange}
                className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                size={1}
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                <option value="">Select a primary genre</option>
                {availableGenres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-violet-200 text-xs mb-2">
                Supporting genre<span className="text-xs text-violet-400 ml-1">(choose 1)</span>
              </p>
              <select
                id="supporting-genre"
                name="supporting_genre_id"
                value={form.genre_ids[0] ?? ""}
                onChange={handleSupportingGenreChange}
                className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                size={1}
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                <option value="">Select a supporting genre</option>
                {availableGenres.map((genre) => (
                  <option
                    key={genre.id}
                    value={genre.id}
                    disabled={genre.id === form.primary_genre_id}
                  >
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-violet-200 text-xs mb-2">
                Tags<span className="text-xs text-violet-400 ml-1">(up to {MAX_TAG_SELECTION})</span>
              </p>
              <div className="relative mb-3">
                <input
                  type="search"
                  value={tagSearch}
                  onChange={(event) => setTagSearch(event.target.value)}
                  className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
                  placeholder="Search tags..."
                />
              </div>
              <div className="max-h-80 overflow-y-auto rounded-lg border border-violet-700/40 bg-[#2a274a] p-4">
                {filteredTags.length === 0 ? (
                  <p className="text-xs text-violet-300/70">No tags match your search.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredTags.map((tag) => {
                      const isSelected = form.tag_ids.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className={`px-3 py-2 text-xs text-left rounded-lg border transition ${
                            isSelected
                              ? "bg-violet-500/20 border-violet-500 text-white"
                              : "bg-[#1f1c3d] border-transparent text-violet-200 hover:border-violet-500/60 hover:bg-[#2a274a]"
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-violet-200 text-xs uppercase tracking-wide mb-2">Selected genres</h4>
                <div className="space-y-2">
                  <div className="bg-[#2a274a] rounded-lg p-3 border border-violet-700/30">
                    <p className="text-xs text-violet-400">Primary</p>
                    <p className="text-sm text-white font-medium mt-1">
                      {selectedPrimaryGenre ? selectedPrimaryGenre.name : "Not selected"}
                    </p>
                  </div>
                  <div className="bg-[#2a274a] rounded-lg p-3 border border-violet-700/30">
                    <p className="text-xs text-violet-400">Supporting</p>
                    <p className="text-sm text-white font-medium mt-1">
                      {selectedGenres.length ? selectedGenres[0]?.name : "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-violet-200 text-xs uppercase tracking-wide mb-2">Selected tags</h4>
                <div className="bg-[#2a274a] rounded-lg p-3 border border-violet-700/30 min-h-[100px]">
                  {selectedTags.length === 0 ? (
                    <p className="text-sm text-violet-300/70">No tags selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs rounded-full bg-violet-500/20 border border-violet-500 text-white"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-[#2a274a] border border-violet-700/50 rounded-2xl p-4">
              <div className="mb-4">
                <h3 className="text-white font-medium">Cover Image</h3>
                <p className="text-xs text-violet-300/80 mt-1">
                  Upload and crop your cover image (will be resized to 600x800px).
                </p>
              </div>

              <CoverImageUpload
                currentImageUrl={displayCoverImage}
                onImageUploaded={async (imageUrl, publicId) => {
                  setExistingCoverUrl(imageUrl);
                  setCoverPublicId(publicId);
                  setCoverImage(null);
                  setCoverPreview(null);
                  
                  // If editing an existing novel, update the cover image immediately
                  if (isEditMode && (editSlug || resolvedSlug || effectivePrefillSlug)) {
                    try {
                      const slugToUpdate = editSlug ?? resolvedSlug ?? effectivePrefillSlug;
                      await api.updateNovel(slugToUpdate!, { cover_image: imageUrl } as any);
                      console.log('✅ Cover image updated successfully in backend');
                    } catch (error) {
                      console.error('Failed to update cover image in backend:', error);
                      toast.error('Cover uploaded to Cloudinary but failed to save to novel. Please try submitting the form.');
                    }
                  }
                }}
                onImageRemoved={async () => {
                  setExistingCoverUrl(null);
                  setCoverPublicId(null);
                  setCoverImage(null);
                  setCoverPreview(null);
                  
                  // If editing an existing novel, remove the cover image immediately
                  if (isEditMode && (editSlug || resolvedSlug || effectivePrefillSlug)) {
                    try {
                      const slugToUpdate = editSlug ?? resolvedSlug ?? effectivePrefillSlug;
                      await api.updateNovel(slugToUpdate!, { cover_image: null } as any);
                      console.log('✅ Cover image removed successfully from backend');
                    } catch (error) {
                      console.error('Failed to remove cover image from backend:', error);
                      toast.error('Failed to remove cover image. Please try again.');
                    }
                  }
                }}
                aspectRatio="cover"
              />
            </div>

            <div className="bg-[#2a274a] border border-violet-700/40 rounded-xl p-4">
              <h4 className="text-sm font-medium text-white mb-2">Tips for standout covers</h4>
              <ul className="text-xs text-violet-200 list-disc list-inside space-y-1">
                <li>Drag the selection box to choose the best crop for your image.</li>
                <li>High-contrast colors and readable typography help your cover pop.</li>
                <li>Use a PNG for crisp graphics or JPG for rich illustrations.</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-[#2a274a] border border-violet-700/40 rounded-xl p-4">
              <h3 className="text-white font-medium text-lg mb-4">Review & Confirm</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-violet-100">
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-violet-400 mb-2">Story Identity</h4>
                  <p><span className="text-violet-300">Title:</span> {form.title || "—"}</p>
                  <p><span className="text-violet-300">Status:</span> {form.status || "—"}</p>
                  <p><span className="text-violet-300">Language:</span> {form.language || "—"}</p>
                  <p><span className="text-violet-300">Content Type:</span> {form.content_type || "—"}</p>
                  <p><span className="text-violet-300">Maturity:</span> {form.maturity_rating || "—"}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wide text-violet-400 mb-2">Story Planning</h4>
                  <p><span className="text-violet-300">Planned Length:</span> {form.planned_length || "—"}</p>
                  <p><span className="text-violet-300">Primary Genre:</span> {selectedPrimaryGenre?.name || "—"}</p>
                  <p>
                    <span className="text-violet-300">Supporting Genre:</span> {" "}
                    {selectedGenres.length ? selectedGenres.map((genre) => genre.name).join(", ") : "—"}
                  </p>
                  <p>
                    <span className="text-violet-300">Tags:</span> {" "}
                    {selectedTags.length ? selectedTags.map((tag) => tag.name).join(", ") : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs uppercase tracking-wide text-violet-400 mb-2">Synopsis</h4>
                <p className="text-sm leading-relaxed text-violet-100 whitespace-pre-wrap bg-[#26224a] p-4 rounded-lg border border-violet-700/30">
                  {form.synopsis || "No synopsis provided."}
                </p>
              </div>
            </div>

            <div className="bg-[#2a274a] border border-violet-700/40 rounded-xl p-4">
              <h4 className="text-xs uppercase tracking-wide text-violet-400 mb-2">Cover Preview</h4>
              <div className="aspect-[3/4] rounded-lg border border-dashed border-violet-500/40 bg-[#1f1c3d] overflow-hidden">
                {displayCoverImage ? (
                  <img src={displayCoverImage} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-violet-300/70 px-4 text-center">
                    No cover uploaded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#120b2a] via-[#1d123d] to-[#120b2a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                {isEditMode ? "Update your novel" : "Create a new novel"}
              </h1>
              <p className="text-sm text-violet-200/80 mt-1">
                {isEditMode
                  ? "Edit your novel details, metadata, and covers in one place."
                  : "Guide your readers into your world with a clear synopsis and strong visuals."}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs uppercase tracking-wide text-violet-200/70">Progress</span>
              <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-400 to-pink-400" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-violet-200/70">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {STEPS.map((wizardStep, index) => {
              const isCompleted = index < step;
              const isActive = index === step;
              return (
                <div
                  key={wizardStep.title}
                  className={`border rounded-xl p-3 transition ${
                    isActive
                      ? "border-violet-400/60 bg-violet-500/10"
                      : isCompleted
                      ? "border-violet-600/40 bg-violet-600/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide text-violet-200/70">Step {index + 1}</p>
                  <h2 className="font-medium text-sm text-white mt-1">{wizardStep.title}</h2>
                  <p className="text-xs text-violet-200/70 mt-1">{wizardStep.description}</p>
                </div>
              );
            })}
          </div>
        </header>

        <main className="space-y-6">
          {errMsg && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
              {errMsg}
            </div>
          )}

          {metadataError && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">
              {metadataError}
              <button
                type="button"
                className="ml-2 underline"
                onClick={() => void loadMetadata()}
              >
                Retry
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#1f1838] border border-violet-800/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-black/40"
          >
            {metadataLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-12 w-12 border-4 border-violet-500/40 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-sm text-violet-100/80">Loading novel metadata…</p>
              </div>
            ) : isLoadingNovel ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-12 w-12 border-4 border-violet-500/40 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-sm text-violet-100/80">Loading your novel details…</p>
              </div>
            ) : (
              renderStepContent()
            )}

            <div className="flex flex-col md:flex-row-reverse md:items-center gap-3 md:gap-4 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={loading || metadataLoading || isLoadingNovel}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading
                  ? isEditMode
                    ? "Updating…"
                    : "Creating…"
                  : isEditMode
                  ? isLastStep
                    ? "Save changes"
                    : "Continue"
                  : isLastStep
                  ? "Create novel"
                  : "Continue"}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isFirstStep || metadataLoading || isLoadingNovel}
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm text-violet-100 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLastStep || metadataLoading || isLoadingNovel}
                  className="px-4 py-2 rounded-lg border border-violet-500/40 text-sm text-violet-100 hover:border-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
