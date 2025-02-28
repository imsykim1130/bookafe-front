import { DOMAIN } from "@/utils"
import axios from "axios"

type User = {
    id: number,
    email: string,
    nickname: string,
    profileImg: string | null,
    createDate: string,
    role: string,
    totalPoint: number
}

// 유저 가져오기 요청
export const getUser = async (jwt: string) => {
    console.log('fetch user');
    return await axios.get(DOMAIN + "/user", {
        headers: {
            Authorization: "Bearer " + jwt,
        }
    }).then((res): User => {
        return res.data;
    }).catch((err) => {
        throw err;
    })
}

// 프로필 이미지 수정
export const updateProfileImg = async (jwt: string, img: File) => {
    // 이미지는 form 에 담아서 보내야 함
    const formData = new FormData();
    formData.append("data", img);
    return await axios.post(DOMAIN + "/user/profile-image", formData, {
        headers: {
            "Authorization" : "Bearer " + jwt,
            "Content-Type" : "multipart/form-data", // 필수
        }
    })
}