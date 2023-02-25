import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, address } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalanceButton = document.getElementById("getBalanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    connectButton.innerHTML = "Connected"
  } else {
    console.log("No MetaMask!!!")
    connectButton.innerHTML = "Please Install MetaMask"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer)

    const fundMe = new ethers.Contract(address, abi, signer)
    console.log(fundMe)

    try {
      const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      //   await listenForTransactionMine(transactionResponse, provider)
      console.log(`${transactionResponse.hash} Fund Done!`)
    } catch (e) {
      console.log(e)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  // listen for this transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(address)
    console.log(`The balance is ${ethers.utils.formatEther(balance)}`)
  }
}

async function withdraw() {
  console.log(`Withdrawing ...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const fundMe = new ethers.Contract(address, abi, signer)

    try {
      const transactionResponse = await fundMe.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
      console.log(`Finish withdrawing the contract`)
    } catch (e) {
      console.log(e)
    }
  }
}
