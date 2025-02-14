# chat/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, BlockedUser
from django.contrib.auth.models import User
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard( 
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = self.scope['user'].username
        receiver = self.room_name # change room name to sender-receiver

        # Check if receiver is blocking the sender
        is_blocked = await self.is_blocked(sender, receiver)
        if is_blocked:
            return  # Do not send message if blocked

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender,
            }
        )

        # Save message to database
        await self.save_message(sender, receiver, message)

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
        }))

    @database_sync_to_async
    def save_message(self, sender_username, receiver_username, content):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        Message.objects.create(sender=sender, receiver=receiver, content=content)

    @database_sync_to_async
    def is_blocked(self, sender_username, receiver_username):
        try:
            sender = User.objects.get(username=sender_username)
            receiver = User.objects.get(username=receiver_username)
            BlockedUser.objects.get(blocker=receiver, blocked=sender)
            return True
        except BlockedUser.DoesNotExist:
            return False
        
    @database_sync_to_async
    def set_online(self, is_online):
        user = self.scope['user']
        if user.is_authenticated:
            OnlineUser.objects.update_or_create(
                user=user,
                defaults={'is_online': is_online}
            )
