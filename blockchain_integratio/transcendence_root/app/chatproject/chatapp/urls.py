from django.urls import path
from .views import MessageListCreateView, BlockedUserListCreateView

urlpatterns = [
    path('messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('blocked-users/', BlockedUserListCreateView.as_view(), name='blocked-user-list-create'),
    path('invitations/', GameInvitationListCreateView.as_view(), name='invitation-list-create'),
]