
const NodeCache = require('node-cache');
const supabase = require('../supabase');
// Create a new instance of NodeCache
const cache = new NodeCache();
const _ =require('lodash');
// Array to store the subscribed Telegram users

// Function to fetch the bug bounty data
async function fetchBugBounty() {
    try {
        const response = await fetch('http://localhost:9898/bugbounty'); // Fetch the bug bounty data from the API
        const data = await response.json();
        return await sortData(data);
    } catch (error) {
        console.error('Error fetching bug bounty:', error);
        throw error;
    }
}

// Function to check for new bug bounty and broadcast to subscribed users
async function checkAndBroadcastBugBounty() {
    try {
        console.log('Checking for new bug bounty...')
        const cachedData = cache.get('bugbounties');
        const newData = await fetchBugBounty();
        console.log('cached bounty: data', cachedData)
        const subscribers = await fetchSubscribers();
        console.log('Subscribers:', subscribers);
        const availableBounties = cachedData.map((bounty:any) => bounty.id);
        newData.forEach((bounty:any) => {
            if (availableBounties.includes(bounty.id)) {
                // New bug bounty found
                console.log('New bug bounty found:', bounty);
                const message = `*New Bug Bounty*\n\n*Title:* ${bounty.title}\n*Description:* ${bounty.description}\n*Link:* ${bounty.link}`;
                subscribers.forEach((userId:string) => sendMessageToUser(userId, message));
            }else {
                console.log('No new bug bounty found');
            }

        });
        cache.set('bugbounties', sortData(newData));

                
            
    } catch (error) {
        console.error('Error checking and broadcasting bug bounty:', error);
    }
}

// Start the worker
async function sendMessageToUser(userId: string, message: string) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: userId,
                text: message,
            }),
        });
        
        const data = await response.json();
        console.log('Message sent:', data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
// Function to fetch subscribers
async function fetchSubscribers() {
    try {
        let subscribedUsers:string[]=[]
        const {data,error} = await supabase.from('tg_users').select('*').eq('subscribed', true);
        data.forEach((user:any) => subscribedUsers.push(user.userid));
        return subscribedUsers;
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        throw error;
    }
}


// Function to sort data based on updatedDate
const sortData = async(data: any[]) => data.sort((a: any, b: any) => Number(new Date(b.updatedDate)) - Number(new Date(a.updatedDate)));
setInterval(checkAndBroadcastBugBounty, 10000); // Run every minute
