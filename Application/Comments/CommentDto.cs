using Domain;

namespace Application.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public string CreatedAt { get; set; }
    }
}
