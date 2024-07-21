import { client } from "@/lib/hono"
import { useQuery } from "@tanstack/react-query"

export const useGetImages = () => {
    const query = useQuery({
        queryKey: ["images"],
        queryFn: async () => {
            const reponse = await client.api.image.$get()

            if (!reponse.ok) {
                throw new Error("Failed to featch Images")
            }

            const { data } = await reponse.json()
            return data
        },
    })
    return query
}
