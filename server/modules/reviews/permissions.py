from rest_framework import permissions

class IsReviewAuthorOrNovelAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow review authors or novel authors to edit/delete,
    others have read-only access.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Review author can edit/delete
        if obj.user == request.user:
            return True

        # Novel author can delete reviews of their novel
        if obj.novel.author == request.user and request.method == 'DELETE':
            return True

        return False
