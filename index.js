var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    dota2 = require("../"),
    _ = require("underscore"),
    bot = new steam.SteamClient(),
    Dota2 = new dota2.Dota2Client(bot, true),
    Mmr = require('./connection');

    var newMmr = new Mmr({
        steamID: '823232340994'
      , initialSoloMMR: '4052'
      , initialPartyMMR: '4305'
    });

    newMmr.save(function(err, newMmr) {
      if (err) return console.error(err);
      console.dir(newMmr);
    });

global.config = require("./config");

/* Steam logic */
var onSteamLogOn = function onSteamLogOn(){
        bot.setPersonaState(steam.EPersonaState.Busy); // to display your bot's status as "Online"
        bot.setPersonaName(config.steam_name); // to change its nickname
        util.log("Logged on.");
    },
    onSteamSentry = function onSteamSentry(sentry) {
        util.log("Received sentry.");
        require('fs').writeFileSync('sentry', sentry);
    },
    onSteamServers = function onSteamServers(servers) {
        util.log("Received servers.");
        fs.writeFile('servers', JSON.stringify(servers));
    },
    onWebSessionID = function onWebSessionID(webSessionID) {
        util.log("Received web session id.");
        // steamTrade.sessionID = webSessionID;
        bot.webLogOn(function onWebLogonSetTradeCookies(cookies) {
            util.log("Received cookies.");
            for (var i = 0; i < cookies.length; i++) {
                // steamTrade.setCookie(cookies[i]);
            }
      onLaunchDota();

    });
    },
    onLaunchDota = function onLaunchDota(){

        Dota2.launch();
        Dota2.on("ready", function() {
            console.log("Node-dota2 ready.");
            /* Note:  Should not declare new event listeners nested inside of
            'ready', else you could end up with duplicated handlers if 'ready'
            is fired multiple times.  Exception is made within this test file
            for the same of keeping relevant samples together. */


            console.log("searching for pending friend requests...");
            console.log(bot.friends);
            
           _.each(bot.friends, function(relationship, steamID) {
                if (relationship == steam.EFriendRelationship.RequestRecipient) {

                    bot.addFriend(steamID);

                    console.log(steamID+" was added as a friend");

                    setTimeout(function () {
                    console.log('attempting to check mmr');
                      usermmrCheck = Dota2.ToAccountID(steamID);

                      Dota2.profileRequest(usermmrCheck, true, function(err, data){
                        var data = JSON.stringify(data),
                        profile = JSON.parse(data);

                        console.log(profile);

                        var gameAccount = profile.gameAccountClient["accountId"],
                        soloMMR = profile.gameAccountClient["soloCompetitiveRank"],
                        partyMMR = profile.gameAccountClient["competitiveRank"];

                        bot.sendMessage(steamID,'hey it\'s Dota.House[BOT] I\'ve got your Solo MMR: '+soloMMR+' & Party MMR: '+partyMMR+' on file. You should now be all set to VERIFY on your [Dota.House] user profile. Have fun and Enjoy!');

                      });

                    }, 1500);

               }
            });

      bot.on("friend", function(steamID, relationship) {
      if (relationship == steam.EFriendRelationship.RequestRecipient) {
          console.log("friend request received");
          bot.addFriend(steamID);
          console.log("friend request accepted");

          setTimeout(function () {
          
            usermmrCheck = Dota2.ToAccountID(steamID);

            Dota2.profileRequest(usermmrCheck, true, function(err, data){
              var data = JSON.stringify(data),
              profile = JSON.parse(data);

              console.log(profile);

              var gameAccount = profile.gameAccountClient["accountId"],
              soloMMR = profile.gameAccountClient["soloCompetitiveRank"],
              partyMMR = profile.gameAccountClient["competitiveRank"];

              bot.sendMessage(steamID,'hey it\'s Dota.House[BOT] I\'ve got your Solo MMR: '+soloMMR+' & Party MMR: '+partyMMR+' on file. You should now be all set to VERIFY on your [Dota.House] user profile. Have fun and Enjoy!');

            });

          }, 1500);

      }
      });

            console.log("finished searching");


            //TESTING MMR GET
            //augustmmrCheck = Dota2.ToAccountID('76561197981051489');

            //Dota2.profileRequest(augustmmrCheck, true, function(err, data){
            //var data = JSON.stringify(data),
            //profile = JSON.parse(data);

            //var gameAccount = profile.gameAccountClient["accountId"],
            //soloMMR = profile.gameAccountClient["soloCompetitiveRank"],
            //partyMMR = profile.gameAccountClient["competitiveRank"];

            //console.log(soloMMR);
            //});

            /* INVENTORY */
            // Dota2.setItemPositions([[ITEM ID, POSITION]]);
            // Dota2.deleteItem(ITEM ID);

            /* MATCHES */
                // Event based
            // Dota2.matchDetailsRequest(246546269);
            // Dota2.on("matchData", function (matchId, matchData) {
            //     console.log(JSON.stringify(matchData, null, 2));
            // });
            // Dota2.matchmakingStatsRequest();
            // Dota2.on("matchmakingStatsData", function(waitTimesByGroup, searchingPlayersByGroup, disabledGroups, matchmakingStatsResponse) {
            //     console.log(JSON.stringify(matchmakingStatsResponse, null, 2));
            // });

                // Callback based
            // Dota2.matchDetailsRequest(246546269, function(err, body){
            //     if (err) console.log(err);
            //     console.log(JSON.stringify(body));
            // });

            /* COMMUNITY */
                // Event based
            // Dota2.profileRequest(28956443, true);
            // Dota2.on("profileData", function (accountId, profileData) {
            //     console.log(JSON.stringify(profileData, null, 2));
            // });
            // Dota2.passportDataRequest(28956443);
            // Dota2.on("passportData", function (accountId, passportData) {
            //     console.log(passportData.leagueGuesses.stampedPlayers);
            // });
            // Dota2.hallOfFameRequest();
            // Dota2.on("hallOfFameData", function(week, featuredPlayers, featuredFarmer, hallOfFameResponse) {
            //     console.log(JSON.stringify(hallOfFameResponse, null, 2));
            // });

                // Callback based
            // Dota2.profileRequest(28956443, true, function(err, body){
            //     console.log(JSON.stringify(body));
            // });
            // Dota2.passportDataRequest(28956443, function(err, body){
            //     console.log(JSON.stringify(body));
            // });
            // Dota2.hallOfFameRequest(null, function(err, body){
            //     console.log(JSON.stringify(body));
            // });

            /* CHAT */
                // Event based
             //Dota2.joinChat("bteamgaming");
            // setTimeout(function(){ Dota2.sendMessage("rj", "wowoeagnaeigniaeg"); }, 5000);
            // setTimeout(function(){ Dota2.leaveChat("rj"); }, 10000);

            /* GUILD */
            // Dota2.requestGuildData();
            // Dota2.on("guildOpenPartyData", function(guildId, openParties){
                    // Event based
                // Dota2.inviteToGuild(guildId, 28956443);
                // Dota2.setGuildAccountRole(guildId, 28956443, 2);
                // Dota2.cancelInviteToGuild(guildId, 75028261);

                    // Callback based
                // Dota2.inviteToGuild(guildId, 28956443, function(err, body){
                //     console.log(JSON.stringify(body));
                // });
                // Dota2.cancelInviteToGuild(guildId, 75028261, function(err, body){
                //     console.log(JSON.stringify(body));
                // });
                // Dota2.setGuildAccountRole(guildId, 28956443, 2, function(err, body){
                //     console.log(JSON.stringify(body));
                // });

                    // Doing chat stuffs.
                // var guildChannelName = util.format("Guild_%s", guildId);
                // Dota2.joinChat(guildChannelName, dota2.DOTAChatChannelType_t.DOTAChannelType_Guild);

                // setTimeout(function(){ Dota2.sendMessage(guildChannelName, "wowoeagnaeigniaeg"); }, 5000);
                // setTimeout(function(){ Dota2.leaveChat(guildChannelName); }, 10000);
            // });

            /* LOBBIES */
            // Dota2.createPracticeLobby("Techies cheese", "boop", Dota2.ServerRegion.PERFECTWORLDTELECOM, Dota2.GameMode.DOTA_GAMEMODE_AR, function(err, body){
            //     console.log(JSON.stringify(body));
            // });

            // setTimeout(function(){
            //     Dota2.leavePracticeLobby(function(err, body){
            //         console.log(JSON.stringify(body));
            //     });
            // }, 60000);

            /* LEAGUES */
            // Dota2.leaguesInMonthRequest(10, 2013, function(err, data) { // November 2013
            //     console.log('Found ' + data.leagues.length + ' leagues full of schedule data :D');
            // });

            // Dota2.leaguesInMonthRequest(10, 2013); // November 2013
            // Dota2.on("leaguesInMonthResponse",  function(err, data) {
            //     console.log('Found ' + data.leagues.length + ' leagues full of schedule data :D');
            // });

            /* SOURCETV */
            // Dota2.findSourceTVGames({}, function(data) {    // May 2015
            //   console.log('Successfully received SourceTVGames: ' + data.games);
            // })


        });



        Dota2.on("unready", function onUnready(){
            console.log("Node-dota2 unready.");
        });

        Dota2.on("chatMessage", function(channel, personaName, message) {
            // util.log([channel, personaName, message].join(", "));
        });

        Dota2.on("guildInvite", function(guildId, guildName, inviter) {
            // Dota2.setGuildAccountRole(guildId, 75028261, 3);
        });


        Dota2.on("unhandled", function(kMsg) {
            util.log("UNHANDLED MESSAGE " + kMsg);
        });
        // setTimeout(function(){ Dota2.exit(); }, 5000);

    };



// Login, only passing authCode if it exists
var logOnDetails = {
    "accountName": config.steam_user,
    "password": config.steam_pass,
};
if (config.steam_guard_code) logOnDetails.authCode = config.steam_guard_code;
var sentry = fs.readFileSync('sentry');
if (sentry.length) logOnDetails.shaSentryfile = sentry;
bot.logOn(logOnDetails);
bot.on("loggedOn", onSteamLogOn)
    .on('sentry', onSteamSentry)
    .on('servers', onSteamServers)
    .on('webSessionID', onWebSessionID);
