from web3 import Web3
import json
import os
from django.conf import settings

class BlockchainService:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider("http://blockchain:8545"))
        self.contract = self._load_contract()

    def _load_contract(self):
        with open(os.path.join(settings.BASE_DIR, 'blockchain/artifacts/contracts/ScoreStorage.sol/ScoreStorage.json')) as f:
            artifact = json.load(f)
        return self.w3.eth.contract(
            address=settings.CONTRACT_ADDRESS,
            abi=artifact['abi']
        )

    def store_score(self, user_address, score):
        return self.contract.functions.storeScore(score).transact({
            'from': user_address,
            'gas': 1000000
        })
    


HERE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<