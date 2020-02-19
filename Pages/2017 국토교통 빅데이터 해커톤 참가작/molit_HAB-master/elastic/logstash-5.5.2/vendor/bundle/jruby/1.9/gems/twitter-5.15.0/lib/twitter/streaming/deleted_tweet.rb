module Twitter
  module Streaming
    class DeletedTweet < Twitter::Identity
      # @return [Integer]
      attr_reader :user_id
    end
    DeletedStatus = DeletedTweet
  end
end
