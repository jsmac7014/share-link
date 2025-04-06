import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";

import {useParams,useNavigate} from "react-router-dom";
import dayjs from "dayjs";

export default function InviteRedirect() {
    const {inviteId} = useParams();
    const navigate = useNavigate();
    const date = dayjs().format("YYYY-MM-DD");

    useEffect(() => {
        async function acceptInvite() {
            // get invite data
            const data = await Meteor.callAsync("invites.get", inviteId);
            // invalid invite
            if (!data) {
                console.error("No data received");
                return;
            }
            // insert current user to group members
            try {
                await Meteor.callAsync("groups.addMember", data.groupId)
                // then navigate to group page
                navigate(`/group/${data.groupId}?date=${date}`, {replace: true});
            } catch (error) {
                alert(error);
                // navigate to home if user is not authorized
                navigate("/");
            }
        }

        acceptInvite();
    }, [inviteId]);

    return (
        <div>
            <h1>Redirecting...</h1>
        </div>
    );
}