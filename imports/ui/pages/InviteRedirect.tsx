import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";

import {useParams,useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {Helmet} from "react-helmet-async";

export default function InviteRedirect() {
    const {inviteId} = useParams();
    const navigate = useNavigate();
    const date = dayjs().format("YYYY-MM-DD");

    useEffect(() => {
        async function acceptInvite() {
            // get invite data
            try {
                const data = await Meteor.callAsync("get.invite", inviteId);
                await Meteor.callAsync("groups.addMember", data.groupId)
                navigate(`/group/${data.groupId}?date=${date}`, {replace: true});

            } catch (error) {
                console.error(error);
                alert(error);
                navigate("/");
            }
        }

        acceptInvite();
    }, [inviteId]);

    return (
        <div>
            <Helmet>
                <title>You have been invited</title>
            </Helmet>
            <h1>Redirecting...</h1>
        </div>
    );
}