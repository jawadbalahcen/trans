from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status 
from django.urls import reverse
from django.http import JsonResponse
import random
import string
from .models import Room

from rest_framework.decorators import api_view
from .serializers import RoomSerializer


class CreateRoomAPIView(APIView):
    def post(self, request, *args, **kwargs):
        player1 = request.data.get("player1")
        player2 = request.data.get("player2")
        print("hello Im here inside")

        if not player1 or not player2:
            return Response({"error": "Both player names are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a random room code with only alphanumeric characters
        def generate_room_code(length=6):
            """Generates a random room code with the specified length."""
            letters_and_digits = string.ascii_letters + string.digits
            return ''.join(random.choice(letters_and_digits) for _ in range(length))

        room_code = generate_room_code()

        # Create the room object and save it to the database
        room = Room.objects.create(
            room_id=room_code,
            player1_name=player1,
            player2_name=player2,
        )

        # Construct WebSocket URL
        ws_url = reverse('game:game_ws', kwargs={'room_code': room_code})

        # Send WebSocket URL and room details back to the players
        return Response({
            "message": "Room created successfully!",
            "room_name": room_code,
            "ws_url": f"ws://127.0.0.1:8000{ws_url}"
        }, status=status.HTTP_201_CREATED)

# You can uncomment these once you ensure proper imports

class GetRoomsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
         # Return the raw JSON response
        return JsonResponse(serializer.data, safe=False)  # `safe=False` allows non-dict data like lists

class GetRoomAPIView(APIView):
    def get(self, request, room_id, *args, **kwargs):
        try:
            room = Room.objects.get(room_id=room_id)
            serializer = RoomSerializer(room)

            # Return the raw JSON response for a specific room
            return JsonResponse(serializer.data, safe=False)  # `safe=False` allows non-dict data like lists
        except Room.DoesNotExist:
            return JsonResponse({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

# blockchain

from pingpong.blockchain.web3_client import load_contract

def store_score(request):
    # if not request.user.is_authenticated:
    #     return JsonResponse({"error": "Unauthorized"}, status=401)
        
    contract = load_contract()
    score = request.POST.get('score', 0)
    
    try:
        tx_hash = contract.functions.storeScore(int(score)).transact({
            'from': request.user.wallet_address
        })
        return JsonResponse({'tx_hash': tx_hash.hex()})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)