from rest_framework import generics
from .models import Message, BlockedUser, GameInvitation
from .serializers import MessageSerializer, BlockedUserSerializer, GameInvitationSerializer

class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(receiver=user)

class BlockedUserListCreateView(generics.ListCreateAPIView):
    queryset = BlockedUser.objects.all()
    serializer_class = BlockedUserSerializer

    def get_queryset(self):
        user = self.request.user
        return BlockedUser.objects.filter(blocker=user)
    def perform_create(self, serializer):
        serializer.save(blocker=self.request.user)

class GameInvitationListCreateView(generics.ListCreateAPIView):
    queryset = GameInvitation.objects.all()
    serializer_class = GameInvitationSerializer

    def get_queryset(self):
        user = self.request.user
        return GameInvitation.objects.filter(receiver=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)